package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.MatchEntity;
import com.vstats.vstats.domain.entities.SeasonEntity;
import com.vstats.vstats.domain.entities.LeagueEntity;
import com.vstats.vstats.domain.entities.SeasonLeagueEntity;
import com.vstats.vstats.domain.entities.TeamEntity;
import com.vstats.vstats.domain.entities.SeasonTeamEntity;
import com.vstats.vstats.domain.entities.VenueEntity;
import com.vstats.vstats.infrastructure.repositories.MatchRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueRepository;
import com.vstats.vstats.infrastructure.repositories.SeasonLeagueRepository;
import com.vstats.vstats.infrastructure.repositories.TeamRepository;
import com.vstats.vstats.infrastructure.repositories.SeasonTeamRepository;
import com.vstats.vstats.infrastructure.repositories.VenueRepository;
import com.vstats.vstats.presentation.requests.chat.*;
import com.vstats.vstats.presentation.responses.ChatResponse;
import com.vstats.vstats.security.AuthUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MatchRepository matchRepository;
    private final SeasonLeagueRepository seasonLeagueRepository;
    private final SeasonTeamRepository seasonTeamRepository;
    private final VenueRepository venueRepository;
    private final AuthUtils authUtils;
    private final RestTemplate restTemplate;

    @Value("${google.ai.key}")
    private String geminiKey;
    @Value("${groq.ai.key}")
    private String groqKey;
    @Value("${cerebras.ai.key}")
    private String cerebrasKey;

    private String buildContext(TeamEntity myTeam, LeagueEntity league, List<MatchEntity> matches,
            List<SeasonTeamEntity> teams, List<VenueEntity> venues) {
        StringBuilder sb = new StringBuilder();
        sb.append("Eres el asistente oficial de V-Stats, una plataforma de gestión de voleibol. ");
        sb.append(
                "Tu objetivo es ayudar al entrenador con datos reales de su liga. Responde de forma concisa y profesional.\n\n");

        sb.append("CONTEXTO ACTUAL:\n");
        sb.append("- Entrenador del equipo: ").append(myTeam.getName()).append("\n");
        sb.append("- Liga: ").append(league.getName()).append("\n");

        sb.append("- Equipos en la liga: ").append(
                teams.stream().map(t -> t.getTeam().getName()).collect(Collectors.joining(", "))).append("\n");

        sb.append("- Calendario de partidos:\n");
        for (MatchEntity m : matches) {
            // Extraemos el nombre de la sede si existe
            String nombreSede = (m.getVenue() != null) ? m.getVenue().getName() : "Sede no asignada";
            String direccionSede = (m.getVenue() != null) ? m.getVenue().getAddress() : "";

            sb.append(String.format("  * %s vs %s | Fecha: %s | Estado: %s | Campo: %s (%s)\n",
                    m.getLocalTeam().getName(),
                    m.getVisitorTeam().getName(),
                    m.getDate(),
                    m.getStatus(),
                    nombreSede,
                    direccionSede));
        }

        sb.append("- Sedes disponibles:\n");
        for (VenueEntity v : venues) {
            sb.append(String.format("  * %s (Dirección: %s)\n", v.getName(), v.getAddress()));
        }

        return sb.toString();
    }

    @Transactional(readOnly = true)
    public ChatResponse createChat(ChatRequest request) {
        // 1. Identificar al Coach y su inscripción actual (Temporada Activa)
        Long currentCoachId = authUtils.getCurrentUserId();

        SeasonTeamEntity mySeasonInscriptions = seasonTeamRepository
                .findByCoach_IdCoachAndSeason_IsActiveTrue(currentCoachId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El entrenador no está inscrito en ninguna temporada activa"));

        // Datos base
        TeamEntity myTeam = mySeasonInscriptions.getTeam();
        SeasonEntity currentSeason = mySeasonInscriptions.getSeason();

        // 2. Obtener la liga a la que pertenece esa temporada
        // Relacionamos a través de la Season que ya tenemos

        LeagueEntity league = mySeasonInscriptions.getLeague();

        // 3. Recoger todos los partidos de esta liga/temporada
        List<MatchEntity> allMatches = matchRepository
                .findAllByLeague_IdLeague(league.getIdLeague());

        // 4. Recoger todos los equipos rivales de la misma liga
        List<SeasonTeamEntity> leagueTeams = seasonTeamRepository
                .findAllBySeason_IdSeason(currentSeason.getIdSeason());

        // 5. Recoger las sedes (Venues)
        // Podemos sacarlas de los partidos o traer todas las disponibles en el sistema
        List<VenueEntity> allVenues = venueRepository.findAll();

        // 6. Construir el prompt con contexto + pregunta
        String systemContext = buildContext(myTeam, league, allMatches, leagueTeams, allVenues);
        String userQuestion = request.getText();

        return ChatResponse.builder()
                .text(tryAllAIs(systemContext, userQuestion))
                .build();
    }

    private String tryAllAIs(String context, String question) {
        try {
            return callGemini(context, question);
        } catch (Exception e) {
            System.err.println("Gemini falló: " + e.getMessage());
            try {
                return callGroq(context, question);
            } catch (Exception e2) {
                System.err.println("Groq falló: " + e2.getMessage());
                try {
                    return callCerebras(context, question);
                } catch (Exception e3) {
                    System.err.println("Cerebras falló, usando Pollinations...");
                    return callPollinations(context, question);
                }
            }
        }
    }

    // --- IMPLEMENTACIONES DE APIs ---

    private String callGemini(String context, String question) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                + geminiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", context + "\n\nPregunta: " + question)))));

        Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);
        // Navegamos por el JSON de respuesta de Google
        List candidates = (List) response.get("candidates");
        Map content = (Map) ((Map) candidates.get(0)).get("content");
        List parts = (List) content.get("parts");
        return (String) ((Map) parts.get(0)).get("text");
    }

    private String callGroq(String context, String question) {
        return callOpenAICompatible("https://api.groq.com/openai/v1/chat/completions", groqKey,
                "llama-3.3-70b-versatile", context, question);
    }

    private String callCerebras(String context, String question) {
        return callOpenAICompatible("https://api.cerebras.ai/v1/chat/completions", cerebrasKey, "llama-3.3-70b",
                context, question);
    }

    // Método genérico para Groq y Cerebras ya que usan el mismo estándar que OpenAI
    private String callOpenAICompatible(String url, String key, String model, String context, String question) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(key);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "system", "content", context),
                        Map.of("role", "user", "content", question)));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        Map response = restTemplate.postForObject(url, entity, Map.class);
        List choices = (List) response.get("choices");
        Map message = (Map) ((Map) choices.get(0)).get("message");
        return (String) message.get("content");
    }

    private String callPollinations(String context, String question) {
        String url = "https://text.pollinations.ai/";
        Map<String, Object> body = Map.of(
                "messages", List.of(
                        Map.of("role", "system", "content", context),
                        Map.of("role", "user", "content", question)),
                "model", "openai");
        try {
            return restTemplate.postForObject(url, body, String.class);
        } catch (Exception e) {
            return "Error: No se pudo obtener respuesta de ninguna IA.";
        }
    }
}
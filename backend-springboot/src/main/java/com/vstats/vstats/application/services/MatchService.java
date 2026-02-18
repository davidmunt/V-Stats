package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.presentation.requests.match.CreateMatchRequest;
import com.vstats.vstats.presentation.requests.match.UpdateMatchRequest;
import com.vstats.vstats.presentation.responses.MatchResponse;
import com.vstats.vstats.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final LeagueRepository leagueRepository;
    private final SeasonTeamRepository seasonTeamRepository;
    private final SetRepository setRepository;
    private final CoachRepository coachRepository;
    private final AnalystRepository analystRepository;
    private final AuthUtils authUtils;
    private final LeagueAdminRepository adminRepository;

    @Transactional
    public MatchResponse createMatch(CreateMatchRequest request, String slugLeague) {
        Long currentAdminId = authUtils.getCurrentUserId();
        LeagueAdminEntity admin = adminRepository.findById(currentAdminId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Administrador no encontrado"));

        if (request.getSlug_team_local().equals(request.getSlug_team_visitor())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un equipo no puede jugar contra sí mismo");
        }

        LocalDateTime matchDate;
        try {
            matchDate = java.time.Instant.parse(request.getDate())
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDateTime();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de fecha inválido");
        }

        LeagueEntity league = leagueRepository.findBySlug(slugLeague)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Liga no encontrada"));

        TeamEntity local = teamRepository.findBySlug(request.getSlug_team_local())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo local no encontrado"));

        TeamEntity visitor = teamRepository.findBySlug(request.getSlug_team_visitor())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo visitante no encontrado"));

        SeasonTeamEntity localSeasonData = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(local.getSlug())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El equipo local no está inscrito en la temporada actual"));

        if (localSeasonData.getVenue() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El equipo local no tiene una sede asignada para jugar");
        }

        String slugMatch = generateUniqueSlug(local.getName() + "-vs-" + visitor.getName());
        MatchEntity match = MatchEntity.builder()
                .slug(slugMatch)
                .league(league)
                .localTeam(local)
                .visitorTeam(visitor)
                .venue(localSeasonData.getVenue())
                .adminCreator(admin)
                .date(matchDate)
                .status("scheduled")
                .isActive(true)
                .currentSet(1)
                .build();

        MatchEntity savedMatch = matchRepository.save(match);

        SetEntity firstSet = SetEntity.builder()
                .slug(slugMatch + "-set-1")
                .match(savedMatch)
                .setNumber(1)
                .localPoints(0)
                .visitorPoints(0)
                .status("active")
                .isActive(true)
                .build();

        setRepository.save(firstSet);
        return mapToResponse(savedMatch);
    }

    @Transactional
    public MatchResponse updateMatch(String slug, UpdateMatchRequest request) {
        // 1. Buscar partido existente (404)
        MatchEntity match = matchRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Partido no encontrado"));

        // Bloquear si ya está eliminado
        if ("deleted".equals(match.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede editar un partido eliminado");
        }

        // 2. Validaciones de Negocio (400)
        if (request.getSlug_team_local().equals(request.getSlug_team_visitor())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un equipo no puede jugar contra sí mismo");
        }

        LocalDateTime matchDate;
        try {
            // OffsetDateTime sí entiende la 'Z', luego lo pasamos a LocalDateTime
            matchDate = java.time.OffsetDateTime.parse(request.getDate()).toLocalDateTime();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Formato de fecha inválido: " + e.getMessage());
        }

        // 3. Cargar nuevas entidades
        TeamEntity local = teamRepository.findBySlug(request.getSlug_team_local())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo local no encontrado"));

        TeamEntity visitor = teamRepository.findBySlug(request.getSlug_team_visitor())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo visitante no encontrado"));

        // 4. Validar Sede del nuevo local
        SeasonTeamEntity localSeasonData = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(local.getSlug())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El nuevo equipo local no tiene datos en esta temporada"));

        if (localSeasonData.getVenue() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El nuevo equipo local no tiene una sede asignada");
        }

        // 5. Aplicar cambios
        match.setLocalTeam(local);
        match.setVisitorTeam(visitor);
        match.setVenue(localSeasonData.getVenue());
        match.setDate(matchDate);

        // 6. Lógica de Status
        if (request.getStatus() != null) {
            String status = request.getStatus().toLowerCase().trim();

            if ("deleted".equals(status)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Para eliminar usa el endpoint DELETE");
            }

            match.setStatus(status);
            match.setIsActive("live".equals(status) || "scheduled".equals(status));
        }

        return mapToResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse startMatch(String matchSlug) {
        MatchEntity match = matchRepository.findBySlug(matchSlug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El partido no existe"));

        if ("finished".equals(match.getStatus()) || "deleted".equals(match.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede iniciar un partido finalizado o eliminado");
        }

        match.setStatus("live");
        match.setIsActive(true);

        SetEntity firstSet = setRepository.findByMatch_SlugAndSetNumber(matchSlug, 1)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No se encontró el primer set del partido"));

        firstSet.setStatus("live");
        firstSet.setIsActive(true);

        setRepository.save(firstSet);
        return mapToResponse(matchRepository.save(match));
    }

    public List<MatchResponse> getMatchesByLeague(String leagueSlug) {
        if (!leagueRepository.findBySlug(leagueSlug).isPresent()) {
            throw new RuntimeException("Error: La liga no existe");
        }
        return matchRepository.findAllByLeague_SlugAndIsActiveTrue(leagueSlug).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public MatchResponse getMatch(String matchSlug) {
        return matchRepository.findBySlug(matchSlug)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Error: Partido no encontrado"));
    }

    public List<MatchResponse> getMatchesByCoach(String coachSlug) {
        if (!coachRepository.existsBySlug(coachSlug)) {
            throw new RuntimeException("Error: El entrenador no existe");
        }

        SeasonTeamEntity st = seasonTeamRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(s -> s.getCoach() != null && s.getCoach().getSlug().equals(coachSlug))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Error: El coach no tiene equipo asignado esta temporada"));

        return getMatchesByTeamId(st.getTeam().getIdTeam());
    }

    public List<MatchResponse> getMatchesByAnalyst(String analystSlug) {
        if (!analystRepository.existsBySlug(analystSlug)) {
            throw new RuntimeException("Error: El analista no existe");
        }

        SeasonTeamEntity st = seasonTeamRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(s -> s.getAnalyst() != null && s.getAnalyst().getSlug().equals(analystSlug))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Error: El analista no tiene equipo asignado esta temporada"));

        return getMatchesByTeamId(st.getTeam().getIdTeam());
    }

    @Transactional
    public void deleteMatch(String slug) {
        MatchEntity match = matchRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "El partido no existe o ya ha sido eliminado"));

        if ("deleted".equals(match.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El partido ya se encuentra en la papelera");
        }

        if ("finished".equals(match.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede eliminar un partido que ya ha finalizado");
        }

        match.setStatus("deleted");
        match.setIsActive(false);
        match.setBoxedAt(LocalDateTime.now());

        matchRepository.save(match);
    }

    private List<MatchResponse> getMatchesByTeamId(Long teamId) {
        return matchRepository.findAllByLocalTeam_IdTeamOrVisitorTeam_IdTeam(teamId, teamId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MatchResponse mapToResponse(MatchEntity match) {
        return MatchResponse.builder()
                .slug_match(match.getSlug())
                .slug_league(match.getLeague().getSlug())
                .slug_team_local(match.getLocalTeam().getSlug())
                .slug_team_visitor(match.getVisitorTeam().getSlug())
                .name(match.getLocalTeam().getName() + " vs " + match.getVisitorTeam().getName())
                .date(match.getDate().toString())
                .current_set(match.getCurrentSet().toString())
                .status(match.getStatus())
                .is_active(match.getIsActive().toString())
                .createdAt(match.getCreatedAt())
                .build();
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = name.toLowerCase()
                .trim()
                .replace(" ", "-")
                .replaceAll("[^a-z0-9-]", "");

        String finalSlug = baseSlug;
        int count = 1;

        while (matchRepository.findBySlug(finalSlug).isPresent()) {
            finalSlug = baseSlug + "-" + count;
            count++;
        }

        return finalSlug;
    }
}
package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.presentation.requests.match.*;
import com.vstats.vstats.presentation.responses.MatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

@Transactional
    public MatchResponse createMatch(CreateMatchRequest request, String slugLeague, String adminId) {
        // 1. Validaciones de Negocio y Existencia
        validateMatchTeams(request.getSlugTeamLocal(), request.getSlugTeamVisitor());
        
        LeagueEntity league = leagueRepository.findBySlug(slugLeague)
                .orElseThrow(() -> new RuntimeException("Error: Liga no encontrada"));
        
        TeamEntity local = teamRepository.findBySlug(request.getSlugTeamLocal())
                .orElseThrow(() -> new RuntimeException("Error: Equipo local no encontrado"));
                
        TeamEntity visitor = teamRepository.findBySlug(request.getSlugTeamVisitor())
                .orElseThrow(() -> new RuntimeException("Error: Equipo visitante no encontrado"));

        // 2. Obtener Sede (Venue) desde SeasonTeam del Local
        SeasonTeamEntity localSeasonData = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(local.getSlug())
                .orElseThrow(() -> new RuntimeException("Error: El equipo local no tiene datos para esta temporada"));

        if (localSeasonData.getVenue() == null) {
            throw new RuntimeException("Error: El equipo local no tiene una sede asignada");
        }

        // 3. Crear el Partido
        String slugMatch = generateUniqueSlug(local.getName() + "-vs-" + visitor.getName());
        MatchEntity match = MatchEntity.builder()
                .slug(slugMatch)
                .league(league)
                .localTeam(local)
                .visitorTeam(visitor)
                .idVenue(localSeasonData.getVenue().getIdVenue().toString())
                .idAdminCreator(adminId)
                .date(LocalDateTime.parse(request.getDate()))
                .status("scheduled")
                .isActive(false) // Iniciamos en false hasta que pase a live
                .currentSet(1)
                .build();

        MatchEntity savedMatch = matchRepository.save(match);

        // 4. Crear el SET 1 automáticamente (Inactivo por defecto)
        SetEntity firstSet = SetEntity.builder()
                .slug(slugMatch + "-set-1")
                .match(savedMatch)
                .setNumber(1)
                .localPoints(0)
                .visitorPoints(0)
                .status("active")
                .isActive(false) // Inactivo hasta que el partido empiece
                .build();
        
        setRepository.save(firstSet);

        return mapToResponse(savedMatch);
    }

    @Transactional
    public MatchResponse updateMatch(String slug, UpdateMatchRequest request) {
        // 1. Buscar partido existente
        MatchEntity match = matchRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Error: Partido no encontrado"));

        // 2. Validaciones de Equipos (Igual que en create)
        validateMatchTeams(request.getSlugTeamLocal(), request.getSlugTeamVisitor());

        // 3. Validar y Cargar nuevas entidades (Si cambiaron en el update)
        TeamEntity local = teamRepository.findBySlug(request.getSlugTeamLocal())
                .orElseThrow(() -> new RuntimeException("Error: Equipo local no encontrado"));
                
        TeamEntity visitor = teamRepository.findBySlug(request.getSlugTeamVisitor())
                .orElseThrow(() -> new RuntimeException("Error: Equipo visitante no encontrado"));

        // 4. Actualizar Sede basándose en el (posiblemente nuevo) equipo local
        SeasonTeamEntity localSeasonData = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(local.getSlug())
                .orElseThrow(() -> new RuntimeException("Error: El equipo local no tiene datos para esta temporada"));

        if (localSeasonData.getVenue() == null) {
            throw new RuntimeException("Error: El equipo local no tiene una sede asignada");
        }

        // 5. Aplicar cambios
        match.setLocalTeam(local);
        match.setVisitorTeam(visitor);
        match.setIdVenue(localSeasonData.getVenue().getIdVenue().toString());
        match.setDate(LocalDateTime.parse(request.getDate()));
        
        // 6. Lógica de Status e IsActive (Solo true si es "live")
        String status = request.getStatus().toLowerCase();
        match.setStatus(status);
        match.setIsActive(status.equals("live"));

        // Soft delete explícito si el status llega como "deleted"
        if (status.equals("deleted")) {
            match.setIsActive(false);
        }

        return mapToResponse(matchRepository.save(match));
    }

    @Transactional
    public MatchResponse startMatch(String matchSlug) {
        MatchEntity match = matchRepository.findBySlug(matchSlug)
                .orElseThrow(() -> new RuntimeException("Error: El partido no existe"));

        if ("finished".equals(match.getStatus())) {
            throw new RuntimeException("Error: No se puede iniciar un partido ya finalizado");
        }

        // Actualizar el partido
        match.setStatus("live");
        match.setIsActive(true);

        // Actualizar el Set 1 a live
        SetEntity firstSet = setRepository.findByMatch_SlugAndSetNumber(matchSlug, 1)
                .orElseThrow(() -> new RuntimeException("Error: No se encontró el primer set del partido"));
        
        firstSet.setStatus("live");
        firstSet.setIsActive(true);

        setRepository.save(firstSet);
        return mapToResponse(matchRepository.save(match));
    }

    // 2. GET PARTIDOS DE UNA LIGA
    public List<MatchResponse> getMatchesByLeague(String leagueSlug) {
        if (!leagueRepository.findBySlug(leagueSlug).isPresent()) {
            throw new RuntimeException("Error: La liga no existe");
        }
        return matchRepository.findAllByLeague_SlugAndIsActiveTrue(leagueSlug).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 3. GET UN PARTIDO
    public MatchResponse getMatch(String matchSlug) {
        return matchRepository.findBySlug(matchSlug)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Error: Partido no encontrado"));
    }

    // 4. GET PARTIDOS DE UN COACH
    public List<MatchResponse> getMatchesByCoach(String coachSlug) {
        // Validar que el coach existe
        if (!coachRepository.existsBySlug(coachSlug)) {
            throw new RuntimeException("Error: El entrenador no existe");
        }

        // Buscar en qué equipo está el coach este año
        SeasonTeamEntity st = seasonTeamRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(s -> s.getCoach() != null && s.getCoach().getSlug().equals(coachSlug))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Error: El coach no tiene equipo asignado esta temporada"));

        return getMatchesByTeamId(st.getTeam().getIdTeam());
    }

    public List<MatchResponse> getMatchesByAnalyst(String analystSlug) {
        // Validar que el analista existe
        if (!analystRepository.existsBySlug(analystSlug)) {
            throw new RuntimeException("Error: El analista no existe");
        }

        // Buscar equipo del analista
        SeasonTeamEntity st = seasonTeamRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(s -> s.getAnalyst() != null && s.getAnalyst().getSlug().equals(analystSlug))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Error: El analista no tiene equipo asignado esta temporada"));

        return getMatchesByTeamId(st.getTeam().getIdTeam());
    }

    @Transactional
    public void deleteMatch(String slug) {
        MatchEntity match = matchRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));
        match.setStatus("deleted");
        match.setIsActive(false);
        matchRepository.save(match);
    }

    // Función auxiliar para obtener partidos de un equipo (Local o Visitante)
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

    private void validateMatchTeams(String local, String visitor) {
        if (local == null || visitor == null || local.equals(visitor)) {
            throw new RuntimeException("Error: Un equipo no puede jugar contra sí mismo o los datos están vacíos");
        }
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
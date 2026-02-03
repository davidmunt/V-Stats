package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.presentation.requests.league.CreateLeagueRequest;
import com.vstats.vstats.presentation.requests.league.UpdateLeagueRequest;
import com.vstats.vstats.presentation.responses.LeagueResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LineupService {

    private final LineupRepository lineupRepository;
    private final LineupPositionRepository lineupPositionRepository;
    private final MatchRepository matchRepository;
    private final SeasonTeamRepository seasonTeamRepository;
    private final SeasonPlayerRepository seasonPlayerRepository;

    @Transactional
    public LineupResponse createLineup(String matchSlug, String coachSlug, CreateLineupRequest request) {
        // 1. Validar que el partido existe
        MatchEntity match = matchRepository.findBySlug(matchSlug)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado"));

        // 2. Identificar el equipo a través del Coach en la temporada activa
        SeasonTeamEntity st = seasonTeamRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(s -> s.getCoach() != null && s.getCoach().getSlug().equals(coachSlug))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("El coach no tiene un equipo asignado este año"));

        String teamId = st.getTeam().getIdTeam().toString();

        // 3. Crear la cabecera de la alineación
        String lineupSlug = matchSlug + "-team-" + teamId;
        LineupEntity lineup = LineupEntity.builder()
                .slug(lineupSlug)
                .match(match)
                .idTeam(teamId)
                .status("active")
                .isActive(true)
                .build();

        LineupEntity savedLineup = lineupRepository.save(lineup);

        // 4. Procesar y validar cada jugador en la posición
        savePositions(savedLineup, request.getPositions(), st.getTeam().getSlug());

        return getLineupResponse(savedLineup);
    }

    @Transactional
    public LineupResponse updateLineup(String matchSlug, String coachSlug, UpdateLineupRequest request) {
        // Buscamos el equipo del coach
        SeasonTeamEntity st = seasonTeamRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(s -> s.getCoach() != null && s.getCoach().getSlug().equals(coachSlug))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Equipo no identificado para este coach"));

        // Buscamos la alineación existente
        LineupEntity lineup = lineupRepository.findByMatch_SlugAndIdTeam(matchSlug, st.getTeam().getIdTeam().toString())
                .orElseThrow(() -> new RuntimeException("Alineación no encontrada para actualizar"));

        // Limpiamos posiciones anteriores para poner las nuevas
        lineupPositionRepository.deleteByLineup_IdLineup(lineup.getIdLineup());

        // Guardamos las nuevas posiciones
        savePositions(lineup, request.getPositions(), st.getTeam().getSlug());
        
        if (request.getStatus() != null) lineup.setStatus(request.getStatus());

        return getLineupResponse(lineupRepository.save(lineup));
    }

    private void savePositions(LineupEntity lineup, List<CreateLineupRequest.PositionRequest> positions, String teamSlug) {
        for (CreateLineupRequest.PositionRequest posReq : positions) {
            // Validar que el jugador existe y pertenece a ese equipo esta temporada
            SeasonPlayerEntity sp = seasonPlayerRepository.findByPlayer_SlugAndSeason_IsActiveTrue(posReq.getSlug_player())
                    .orElseThrow(() -> new RuntimeException("Jugador " + posReq.getSlug_player() + " no encontrado"));

            if (!sp.getSeasonTeam().getTeam().getSlug().equals(teamSlug)) {
                throw new RuntimeException("El jugador " + sp.getPlayer().getName() + " no pertenece a este equipo");
            }

            // Crear la entrada en la tabla de posiciones
            LineupPositionEntity lp = LineupPositionEntity.builder()
                    .slug(lineup.getSlug() + "-p" + posReq.getPosition() + "-" + sp.getPlayer().getSlug())
                    .lineup(lineup)
                    .idPlayer(sp.getPlayer().getIdPlayer().toString())
                    .initialPosition(posReq.getPosition())
                    .currentPosition(posReq.getPosition())
                    .isOnCourt(posReq.getPosition() <= 6) // Del 1 al 6 están en pista, 7 es líbero/reserva
                    .isActive(true)
                    .status("active")
                    .build();

            lineupPositionRepository.save(lp);
        }
    }

    private LineupResponse getLineupResponse(LineupEntity lineup) {
        // Aquí recuperaríamos las posiciones guardadas y mapearíamos al DTO LineupResponse
        // que definimos en el paso anterior.
        return LineupResponse.builder()
                .slug_lineup(lineup.getSlug())
                .slug_match(lineup.getMatch().getSlug())
                .slug_team(lineup.getIdTeam())
                .status(lineup.getStatus())
                .build();
    }
}
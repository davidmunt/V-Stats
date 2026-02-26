package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.presentation.requests.lineup.*;
import com.vstats.vstats.presentation.responses.LineupResponse;
import com.vstats.vstats.presentation.responses.LineupsMatchResponse;
import com.vstats.vstats.security.AuthUtils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LineupService {

        private final LineupRepository lineupRepository;
        private final LineupPositionRepository lineupPositionRepository;
        private final MatchRepository matchRepository;
        private final TeamRepository teamRepository;
        private final CoachRepository coachRepository;
        private final SeasonPlayerRepository seasonPlayerRepository;
        private final AuthUtils authUtils;

        // @Transactional
        // public LineupResponse createLineup(CreateLineupRequest request, String
        // slugMatch) {
        // Long coachId = authUtils.getCurrentUserId();
        // CoachEntity coach = coachRepository.findById(coachId)
        // .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
        // "No tienes permiso para crear esta alineación"));
        // Long teamId = coach.getTeam().getIdTeam();
        // MatchEntity match = matchRepository.findBySlug(slugMatch)
        // .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
        // "Partido no encontrado"));

        // TeamEntity team = teamRepository.findById(teamId)
        // .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
        // "Equipo no encontrado"));

        // List<CreateLineupRequest.PlayerPositionRequest> posReq =
        // request.getPositions();
        // if (posReq == null || posReq.size() < 6 || posReq.size() > 7) {
        // throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
        // "La alineación debe tener entre 6 y 7 jugadores");
        // }

        // Set<Integer> uniquePositions = posReq.stream()
        // .map(CreateLineupRequest.PlayerPositionRequest::getPosition)
        // .peek(p -> {
        // if (p < 1 || p > 7)
        // throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
        // "Posición inválida: " + p);
        // })
        // .collect(Collectors.toSet());

        // if (uniquePositions.size() != posReq.size()) {
        // throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
        // "No puede haber posiciones duplicadas");
        // }

        // LineupEntity lineup = lineupRepository
        // .findByMatch_IdMatchAndTeam_IdTeam(match.getIdMatch(), team.getIdTeam())
        // .orElseGet(() -> {
        // String slug = "lineup-" + slugMatch + "-" + team.getSlug();
        // return lineupRepository.save(LineupEntity.builder()
        // .slug(slug)
        // .match(match)
        // .team(team)
        // .status("active")
        // .isActive(true)
        // .build());
        // });

        // if (lineup.getIdLineup() != null) {
        // lineupPositionRepository.deleteByLineup_IdLineup(lineup.getIdLineup());
        // }

        // List<LineupPositionEntity> savedPositions = new ArrayList<>();

        // for (CreateLineupRequest.PlayerPositionRequest pReq : posReq) {
        // SeasonPlayerEntity sp = seasonPlayerRepository
        // .findByPlayer_SlugAndSeason_IsActiveTrue(pReq.getPlayer_id())
        // .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
        // "Jugador no encontrado: " + pReq.getPlayer_id()));

        // LineupPositionEntity lp = LineupPositionEntity.builder()
        // .slug(lineup.getSlug() + "-pos-" + pReq.getPosition())
        // .lineup(lineup)
        // .player(sp.getPlayer())
        // .initialPosition(pReq.getPosition())
        // .currentPosition(pReq.getPosition())
        // .isOnCourt(pReq.getPosition() <= 6)
        // .status("active")
        // .isActive(true)
        // .build();

        // savedPositions.add(lineupPositionRepository.save(lp));
        // }

        // return mapToResponse(lineup, savedPositions);
        // }

        @Transactional
        public LineupResponse createLineup(CreateLineupRequest request, String slugMatch) {
                Long currentUserId = authUtils.getCurrentUserId();
                CoachEntity coach = coachRepository.findById(currentUserId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN,
                                                "No tienes permiso: No eres un entrenador registrado"));

                TeamEntity team = coach.getTeam();

                if (!team.getSlug().equals(request.getSlugTeam())) {
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                                        "No puedes gestionar alineaciones de otro equipo");
                }

                // 2. Buscar el Partido
                MatchEntity match = matchRepository.findBySlug(slugMatch)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Partido no encontrado"));

                // 3. Validaciones de la solicitud (Mantengo tu lógica de 6-7 jugadores)
                List<CreateLineupRequest.PlayerPositionRequest> posReq = request.getPositions();
                if (posReq == null || posReq.size() < 6 || posReq.size() > 7) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La alineación debe tener entre 6 y 7 jugadores");
                }

                Set<Integer> uniquePositions = posReq.stream()
                                .map(CreateLineupRequest.PlayerPositionRequest::getPosition)
                                .peek(p -> {
                                        if (p < 1 || p > 7)
                                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                                "Posición inválida: " + p);
                                })
                                .collect(Collectors.toSet());

                if (uniquePositions.size() != posReq.size()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "No puede haber posiciones duplicadas");
                }

                // 4. Obtener o Crear la cabecera de la alineación
                LineupEntity lineup = lineupRepository
                                .findByMatch_IdMatchAndTeam_IdTeam(match.getIdMatch(), team.getIdTeam())
                                .orElseGet(() -> {
                                        String slug = "lineup-" + slugMatch + "-" + team.getSlug();
                                        return lineupRepository.save(LineupEntity.builder()
                                                        .slug(slug)
                                                        .match(match)
                                                        .team(team)
                                                        .status("active")
                                                        .isActive(true)
                                                        .build());
                                });

                // 5. Limpieza de posiciones previas
                lineupPositionRepository.deleteByLineup_IdLineup(lineup.getIdLineup());
                lineupPositionRepository.flush(); // Forzamos el borrado antes de insertar los nuevos slugs

                // 6. Guardar nuevas posiciones con validación de equipo
                List<LineupPositionEntity> savedPositions = new ArrayList<>();
                for (CreateLineupRequest.PlayerPositionRequest pReq : posReq) {
                        SeasonPlayerEntity sp = seasonPlayerRepository
                                        .findByPlayer_SlugAndSeason_IsActiveTrue(pReq.getPlayer_id())
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Jugador no encontrado: " + pReq.getPlayer_id()));

                        // SEGURIDAD: ¿El jugador es de mi equipo?
                        if (!sp.getSeasonTeam().getTeam().getIdTeam().equals(team.getIdTeam())) {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "El jugador " + sp.getPlayer().getName() + " no pertenece a tu equipo");
                        }

                        LineupPositionEntity lp = LineupPositionEntity.builder()
                                        // Añadimos el player_id al slug para evitar colisiones
                                        .slug(lineup.getSlug() + "-pos-" + pReq.getPosition() + "-"
                                                        + pReq.getPlayer_id())
                                        .lineup(lineup)
                                        .player(sp.getPlayer())
                                        .initialPosition(pReq.getPosition())
                                        .currentPosition(pReq.getPosition())
                                        .isOnCourt(pReq.getPosition() <= 6)
                                        .status("active")
                                        .isActive(true)
                                        .build();

                        savedPositions.add(lineupPositionRepository.save(lp));
                }

                return mapToResponse(lineup, savedPositions);
        }

        ///////////////////////// 77
        public LineupsMatchResponse getLineupsByMatch(String slugMatch) {
                MatchEntity match = matchRepository.findBySlug(slugMatch)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Partido no encontrado"));

                // Usamos el método que busca el dorsal real
                Optional<LineupEntity> homeLineup = lineupRepository.findByMatch_IdMatchAndTeam_IdTeam(
                                match.getIdMatch(), match.getLocalTeam().getIdTeam());

                Optional<LineupEntity> awayLineup = lineupRepository.findByMatch_IdMatchAndTeam_IdTeam(
                                match.getIdMatch(), match.getVisitorTeam().getIdTeam());

                return LineupsMatchResponse.builder()
                                .home(homeLineup.map(this::mapToData).orElse(null))
                                .away(awayLineup.map(this::mapToData).orElse(null))
                                .build();
        }

        private LineupsMatchResponse.LineupData mapToLineupData(LineupEntity lineup) {
                // Buscamos las posiciones de esta alineación específica
                List<LineupPositionEntity> positionEntities = lineupPositionRepository
                                .findAllByLineup_IdLineup(lineup.getIdLineup());

                // Las convertimos al DTO interno de PlayerPosition que espera el front
                List<LineupsMatchResponse.PlayerPosition> positions = positionEntities.stream()
                                .map(lp -> LineupsMatchResponse.PlayerPosition.builder()
                                                .slug_lineup_position(lp.getSlug())
                                                .slug_player(lp.getPlayer().getSlug())
                                                .name(lp.getPlayer().getName())
                                                .image(lp.getPlayer().getImage())
                                                .dorsal(0)
                                                .role("PLAYER")
                                                .initial_position(lp.getInitialPosition())
                                                .current_position(lp.getCurrentPosition())
                                                .is_on_court(lp.getIsOnCourt())
                                                .build())
                                .collect(Collectors.toList());

                return LineupsMatchResponse.LineupData.builder()
                                .slug_lineup(lineup.getSlug())
                                .slug_match(lineup.getMatch().getSlug())
                                .slug_team(lineup.getTeam().getSlug())
                                .status(lineup.getStatus())
                                .is_active(lineup.getIsActive())
                                .positions(positions)
                                .build();
        }
        ///////////////////////////////////

        private LineupsMatchResponse.LineupData mapToData(LineupEntity lineup) {
                List<LineupPositionEntity> positions = lineupPositionRepository
                                .findByLineup_IdLineup(lineup.getIdLineup());

                return LineupsMatchResponse.LineupData.builder()
                                .slug_lineup(lineup.getSlug())
                                .slug_match(lineup.getMatch().getSlug())
                                .slug_team(lineup.getTeam() != null ? lineup.getTeam().getSlug() : "unknown")
                                .status(lineup.getStatus())
                                .is_active(lineup.getIsActive())
                                .positions(positions.stream().map(this::mapToPlayerPosition)
                                                .collect(Collectors.toList()))
                                .build();
        }

        private LineupsMatchResponse.PlayerPosition mapToPlayerPosition(LineupPositionEntity lp) {
                // Buscamos la relación del jugador con la temporada para sacar el dorsal
                // Usamos el ID del jugador y el estado activo de la temporada
                SeasonPlayerEntity sp = seasonPlayerRepository
                                .findByPlayer_IdPlayerAndSeason_IsActiveTrue(lp.getPlayer().getIdPlayer())
                                .orElse(null);

                return LineupsMatchResponse.PlayerPosition.builder()
                                .slug_lineup_position(lp.getSlug())
                                .slug_player(lp.getPlayer().getSlug())
                                .initial_position(lp.getInitialPosition())
                                .current_position(lp.getCurrentPosition())
                                .is_on_court(lp.getIsOnCourt())
                                .name(lp.getPlayer().getName())
                                .image(lp.getPlayer().getImage())
                                // AQUÍ ESTÁ LA MAGIA: Si existe en la temporada, ponemos su dorsal y rol real
                                .dorsal(sp != null ? sp.getDorsal() : 0)
                                .role(sp != null ? sp.getRole() : "PLAYER")
                                .build();
        }

        public LineupResponse getLineup(String slugMatch, String slugTeam) {
                // 1. Buscamos el partido y el equipo por sus slugs
                MatchEntity match = matchRepository.findBySlug(slugMatch)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Partido no encontrado"));

                TeamEntity team = teamRepository.findBySlug(slugTeam)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Equipo no encontrado"));

                // 2. Intentamos buscar la alineación
                Optional<LineupEntity> lineupOpt = lineupRepository
                                .findByMatch_IdMatchAndTeam_IdTeam(match.getIdMatch(), team.getIdTeam());

                // 3. Si NO existe la alineación, devolvemos una respuesta con lista vacía en
                // lugar de 404
                if (lineupOpt.isEmpty()) {
                        // Creamos un objeto "vacío" o temporal para el response,
                        // o simplemente pasamos una lista vacía a tu mapper
                        return mapToResponse(null, new ArrayList<>());
                        // Nota: Asegúrate de que tu mapToResponse controle si el primer parámetro es
                        // null
                }

                // 4. Si existe, buscamos sus posiciones de forma eficiente
                LineupEntity lineup = lineupOpt.get();
                List<LineupPositionEntity> positions = lineupPositionRepository
                                .findAllByLineup_IdLineup(lineup.getIdLineup());

                return mapToResponse(lineup, positions);
        }

        private LineupResponse mapToResponse(LineupEntity lineup, List<LineupPositionEntity> positions) {
                if (lineup == null) {
                        return LineupResponse.builder()
                                        .positions(new ArrayList<>())
                                        .build();
                }

                // Forzamos el tipo en el map para que el compilador no se pierda
                List<LineupResponse.PlayerPosition> posList = positions.stream()
                                .map(lp -> {
                                        PlayerEntity p = lp.getPlayer();
                                        SeasonPlayerEntity sp = seasonPlayerRepository
                                                        .findByPlayer_IdPlayerAndSeason_IsActiveTrue(p.getIdPlayer())
                                                        .orElse(null);

                                        // Construimos el objeto explícitamente
                                        return LineupResponse.PlayerPosition.builder()
                                                        .slug(lp.getSlug())
                                                        .slug_lineup_position(lp.getSlug())
                                                        .slug_lineup(lineup.getSlug())
                                                        .slug_team(lineup.getTeam().getSlug())
                                                        .slug_player(p.getSlug())
                                                        .name(p.getName())
                                                        // Si PlayerEntity no tiene role/dorsal, usamos valores de la
                                                        // posición o defecto
                                                        .role(sp != null ? sp.getRole() : "PLAYER")
                                                        .image(p.getImage())
                                                        .dorsal(sp != null ? sp.getDorsal() : 0) // El dorsal real está
                                                                                                 // en SeasonPlayer, pon
                                                                                                 // 0 o
                                                        // búscalo si es crítico
                                                        .is_on_court(lp.getIsOnCourt())
                                                        .initial_position(lp.getInitialPosition())
                                                        .current_position(lp.getCurrentPosition())
                                                        .status(lp.getStatus())
                                                        .is_active(lp.getIsActive())
                                                        .build();
                                })
                                .collect(Collectors.toList());

                return LineupResponse.builder()
                                .slug(lineup.getSlug())
                                .slug_lineup(lineup.getSlug())
                                .slug_match(lineup.getMatch().getSlug())
                                .slug_team(lineup.getTeam().getSlug())
                                .status(lineup.getStatus())
                                .is_active(lineup.getIsActive())
                                .created_at(lineup.getCreatedAt() != null ? lineup.getCreatedAt().toString() : "")
                                .positions(posList)
                                .build();
        }
}

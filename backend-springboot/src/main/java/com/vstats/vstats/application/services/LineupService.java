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

                MatchEntity match = matchRepository.findBySlug(slugMatch)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Partido no encontrado"));

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

                lineupPositionRepository.deleteByLineup_IdLineup(lineup.getIdLineup());
                lineupPositionRepository.flush();

                List<LineupPositionEntity> savedPositions = new ArrayList<>();
                for (CreateLineupRequest.PlayerPositionRequest pReq : posReq) {
                        SeasonPlayerEntity sp = seasonPlayerRepository
                                        .findByPlayer_SlugAndSeason_IsActiveTrue(pReq.getPlayer_id())
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Jugador no encontrado: " + pReq.getPlayer_id()));

                        if (!sp.getSeasonTeam().getTeam().getIdTeam().equals(team.getIdTeam())) {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "El jugador " + sp.getPlayer().getName() + " no pertenece a tu equipo");
                        }

                        LineupPositionEntity lp = LineupPositionEntity.builder()
                                        .slug(lineup.getSlug() + "-pos-" + pReq.getPosition() + "-"
                                                        + pReq.getPlayer_id())
                                        .lineup(lineup)
                                        .player(sp.getPlayer())
                                        .initialPosition(pReq.getPosition())
                                        .currentPosition(pReq.getPosition())
                                        .isOnCourt(pReq.getPosition() <= 6)
                                        .isSetter(pReq.getIsSetter())
                                        .liberoSwapTarget(pReq.getLiberoSwapTarget())
                                        .status("active")
                                        .isActive(true)
                                        .build();

                        savedPositions.add(lineupPositionRepository.save(lp));
                }

                return mapToResponse(lineup, savedPositions);
        }

        public LineupsMatchResponse getLineupsByMatch(String slugMatch) {
                MatchEntity match = matchRepository.findBySlug(slugMatch)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Partido no encontrado"));

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
                List<LineupPositionEntity> positionEntities = lineupPositionRepository
                                .findAllByLineup_IdLineup(lineup.getIdLineup());

                List<LineupsMatchResponse.PlayerPosition> positions = positionEntities.stream()
                                .map(lp -> LineupsMatchResponse.PlayerPosition.builder()
                                                .slug_lineup_position(lp.getSlug())
                                                .slug_player(lp.getPlayer().getSlug())
                                                .name(lp.getPlayer().getName())
                                                .image(lp.getPlayer().getImage())
                                                .dorsal(0)
                                                .role("PLAYER")
                                                .is_setter(lp.getIsSetter())
                                                .libero_swap_target(lp.getLiberoSwapTarget())
                                                .initial_position(lp.getInitialPosition())
                                                .current_position(lp.getCurrentPosition())
                                                .is_on_court(lp.getIsOnCourt())
                                                .build())
                                .collect(Collectors.toList());

                return LineupsMatchResponse.LineupData.builder()
                                .slug_lineup(lineup.getSlug())
                                .slug_match(lineup.getMatch().getSlug())
                                .slug_team(lineup.getTeam().getSlug())
                                .name(lineup.getTeam() != null ? lineup.getTeam().getName() : "Equipo desconocido")
                                .image(lineup.getTeam() != null ? lineup.getTeam().getImage() : "")
                                .status(lineup.getStatus())
                                .is_active(lineup.getIsActive())
                                .positions(positions)
                                .build();
        }

        private LineupsMatchResponse.LineupData mapToData(LineupEntity lineup) {
                List<LineupPositionEntity> positions = lineupPositionRepository
                                .findByLineup_IdLineup(lineup.getIdLineup());

                return LineupsMatchResponse.LineupData.builder()
                                .slug_lineup(lineup.getSlug())
                                .slug_match(lineup.getMatch().getSlug())
                                .slug_team(lineup.getTeam() != null ? lineup.getTeam().getSlug() : "unknown")
                                .name(lineup.getTeam() != null ? lineup.getTeam().getName() : "Equipo desconocido")
                                .image(lineup.getTeam() != null ? lineup.getTeam().getImage() : "")
                                .status(lineup.getStatus())
                                .is_active(lineup.getIsActive())
                                .positions(positions.stream().map(this::mapToPlayerPosition)
                                                .collect(Collectors.toList()))
                                .build();
        }

        private LineupsMatchResponse.PlayerPosition mapToPlayerPosition(LineupPositionEntity lp) {
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
                                .dorsal(sp != null ? sp.getDorsal() : 0)
                                .role(sp != null ? sp.getRole() : "PLAYER")
                                .is_setter(lp.getIsSetter())
                                .libero_swap_target(lp.getLiberoSwapTarget())
                                .build();
        }

        public LineupResponse getLineup(String slugMatch, String slugTeam) {
                MatchEntity match = matchRepository.findBySlug(slugMatch)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Partido no encontrado"));

                TeamEntity team = teamRepository.findBySlug(slugTeam)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Equipo no encontrado"));

                Optional<LineupEntity> lineupOpt = lineupRepository
                                .findByMatch_IdMatchAndTeam_IdTeam(match.getIdMatch(), team.getIdTeam());

                if (lineupOpt.isEmpty()) {
                        return mapToResponse(null, new ArrayList<>());
                }

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

                List<LineupResponse.PlayerPosition> posList = positions.stream()
                                .map(lp -> {
                                        PlayerEntity p = lp.getPlayer();
                                        SeasonPlayerEntity sp = seasonPlayerRepository
                                                        .findByPlayer_IdPlayerAndSeason_IsActiveTrue(p.getIdPlayer())
                                                        .orElse(null);

                                        return LineupResponse.PlayerPosition.builder()
                                                        .slug(lp.getSlug())
                                                        .slug_lineup_position(lp.getSlug())
                                                        .slug_lineup(lineup.getSlug())
                                                        .slug_team(lineup.getTeam().getSlug())
                                                        .slug_player(p.getSlug())
                                                        .name(p.getName())
                                                        .is_setter(lp.getIsSetter())
                                                        .libero_swap_target(lp.getLiberoSwapTarget())
                                                        .role(sp != null ? sp.getRole() : "PLAYER")
                                                        .image(p.getImage())
                                                        .dorsal(sp != null ? sp.getDorsal() : 0)
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

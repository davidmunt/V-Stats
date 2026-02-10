package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.presentation.requests.lineup.*;
import com.vstats.vstats.presentation.responses.LineupResponse;
import com.vstats.vstats.presentation.responses.LineupsMatchResponse;
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
        private final SeasonPlayerRepository seasonPlayerRepository;

        @Transactional
        public LineupResponse createLineup(CreateLineupRequest request, String slugMatch, Long coachId) {
                MatchEntity match = matchRepository.findBySlug(slugMatch)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Partido no encontrado"));

                TeamEntity team = teamRepository.findBySlug(request.getSlugTeam())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Equipo no encontrado"));

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

                if (lineup.getIdLineup() != null) {
                        lineupPositionRepository.deleteByLineup_IdLineup(lineup.getIdLineup());
                }

                List<LineupPositionEntity> savedPositions = new ArrayList<>();

                for (CreateLineupRequest.PlayerPositionRequest pReq : posReq) {
                        SeasonPlayerEntity sp = seasonPlayerRepository
                                        .findByPlayer_SlugAndSeason_IsActiveTrue(pReq.getPlayer_id())
                                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                        "Jugador no encontrado: " + pReq.getPlayer_id()));

                        LineupPositionEntity lp = LineupPositionEntity.builder()
                                        .slug(lineup.getSlug() + "-pos-" + pReq.getPosition())
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

        public LineupsMatchResponse getLineupsByMatch(String slugMatch) {
                MatchEntity match = matchRepository.findBySlug(slugMatch)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Partido no encontrado"));

                Optional<LineupEntity> homeLineup = lineupRepository.findByMatch_SlugAndTeam_IdTeam(
                                slugMatch, match.getLocalTeam().getIdTeam());

                Optional<LineupEntity> awayLineup = lineupRepository.findByMatch_SlugAndTeam_IdTeam(
                                slugMatch, match.getVisitorTeam().getIdTeam());

                return LineupsMatchResponse.builder()
                                .home(homeLineup.map(this::mapToData).orElse(null))
                                .away(awayLineup.map(this::mapToData).orElse(null))
                                .build();
        }

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
                SeasonPlayerEntity sp = seasonPlayerRepository
                                .findByPlayer_IdPlayerAndSeason_IsActiveTrue(lp.getPlayer().getIdPlayer())
                                .orElse(null);

                return LineupsMatchResponse.PlayerPosition.builder()
                                .slug_lineup_position(lp.getSlug())
                                .slug_player(sp != null ? sp.getPlayer().getSlug() : "unknown")
                                .initial_position(lp.getInitialPosition())
                                .current_position(lp.getCurrentPosition())
                                .is_on_court(lp.getIsOnCourt())
                                .name(sp != null ? sp.getPlayer().getName() : null)
                                .dorsal(sp != null ? sp.getDorsal() : null)
                                .role(sp != null ? sp.getRole() : null)
                                .image(sp != null ? sp.getPlayer().getAvatar() : null)
                                .build();
        }

        public LineupResponse getLineup(String slugTeam) {
                LineupEntity lineup = lineupRepository
                                .findByMatch_IdMatchAndTeam_IdTeam(null, teamRepository.findBySlug(slugTeam)
                                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                                "Equipo no encontrado"))
                                                .getIdTeam())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Alineación no encontrada"));

                List<LineupPositionEntity> positions = lineupPositionRepository.findAll().stream()
                                .filter(lp -> lp.getLineup().getIdLineup().equals(lineup.getIdLineup()))
                                .collect(Collectors.toList());

                return mapToResponse(lineup, positions);
        }

        private LineupResponse mapToResponse(LineupEntity lineup, List<LineupPositionEntity> positions) {
                List<LineupResponse.PlayerPosition> positionResponses = positions.stream()
                                .map(lp -> {
                                        SeasonPlayerEntity sp = seasonPlayerRepository
                                                        .findByPlayer_IdPlayerAndSeason_IsActiveTrue(
                                                                        lp.getPlayer().getIdPlayer())
                                                        .orElse(null);

                                        return LineupResponse.PlayerPosition.builder()
                                                        .slug_lineup_position(lp.getSlug())
                                                        .slug_player(lp.getPlayer() != null ? lp.getPlayer().getSlug()
                                                                        : "unknown")
                                                        .initial_position(lp.getInitialPosition())
                                                        .current_position(lp.getCurrentPosition())
                                                        .is_on_court(lp.getIsOnCourt())
                                                        .name(lp.getPlayer() != null ? lp.getPlayer().getName() : null)
                                                        .image(lp.getPlayer() != null ? lp.getPlayer().getAvatar()
                                                                        : null)
                                                        .dorsal(sp != null ? sp.getDorsal() : null)
                                                        .role(sp != null ? sp.getRole() : null)
                                                        .build();
                                })
                                .sorted(Comparator.comparing(LineupResponse.PlayerPosition::getInitial_position))
                                .collect(Collectors.toList());

                return LineupResponse.builder()
                                .slug_lineup(lineup.getSlug())
                                .slug_match(lineup.getMatch().getSlug())
                                .slug_team(lineup.getTeam() != null ? lineup.getTeam().getSlug() : "unknown")
                                .positions(positionResponses)
                                .build();
        }
}

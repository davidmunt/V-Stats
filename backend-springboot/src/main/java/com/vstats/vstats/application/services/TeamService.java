package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.infrastructure.specs.TeamSpecification;
import com.vstats.vstats.presentation.requests.team.*;
import com.vstats.vstats.presentation.responses.TeamResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final SeasonTeamRepository seasonTeamRepository;
    private final SeasonRepository seasonRepository;
    private final LeagueRepository leagueRepository;
    private final SeasonLeagueRepository seasonLeagueRepository;
    private final VenueRepository venueRepository;
    private final CoachRepository coachRepository;
    private final AnalystRepository analystRepository;

    @Transactional
    public TeamResponse createTeam(CreateTeamRequest request) {
        SeasonEntity currentSeason = seasonRepository.findByIsActiveTrue()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay temporada activa"));

        LeagueEntity league = leagueRepository.findBySlug(request.getSlug_league())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Liga no encontrada"));

        seasonLeagueRepository.findByLeagueAndSeason(league, currentSeason)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Esa liga no está disponible esta temporada"));

        VenueEntity venue = venueRepository.findBySlug(request.getSlug_venue())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sede no encontrada"));

        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del equipo es obligatorio");
        }
        if (request.getImage() == null || request.getImage().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La imagen del equipo es obligatoria");
        }

        String slug = generateUniqueSlug(request.getName());
        TeamEntity team = teamRepository.findBySlug(slug)
                .orElseGet(() -> teamRepository.save(
                        TeamEntity.builder()
                                .name(request.getName())
                                .slug(slug)
                                .image(request.getImage())
                                .build()));

        SeasonTeamEntity teamSeason = SeasonTeamEntity.builder()
                .team(team)
                .season(currentSeason)
                .league(league)
                .venue(venue)
                .status("active")
                .isActive(true)
                .build();

        return mapToResponse(seasonTeamRepository.save(teamSeason));
    }

    public Map<String, Object> getAllTeams(String q, String status, String slug_league, String sort, int page,
            int size) {

        LeagueEntity league = leagueRepository.findBySlug(slug_league)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Liga no encontrada"));

        Sort sortOrder = switch (sort != null ? sort : "recent") {
            case "name_asc" -> Sort.by("team.name").ascending();
            default -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Specification<SeasonTeamEntity> spec = TeamSpecification.build(q, league.getIdLeague(), status);

        Page<SeasonTeamEntity> entitiesPage = seasonTeamRepository.findAll(spec, pageable);

        List<TeamResponse> teams = entitiesPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("teams", teams);
        response.put("total", entitiesPage.getTotalElements());
        response.put("page", entitiesPage.getNumber());
        response.put("total_pages", entitiesPage.getTotalPages());
        response.put("filters_applied", Map.of("q", q != null ? q : "", "league", slug_league));

        return response;
    }

    public List<TeamResponse> getTeamsByLeagueSlug(String slugLeague) {
        Long leagueId = leagueRepository.findBySlug(slugLeague)
                .map(LeagueEntity::getIdLeague)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Liga no encontrada"));

        return seasonTeamRepository.findAllByLeague_IdLeagueAndSeason_IsActiveTrue(leagueId).stream()
                .filter(ts -> !"deleted".equals(ts.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TeamResponse getTeamBySlug(String slug) {
        SeasonTeamEntity ts = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Equipo no encontrado en la temporada actual"));
        return mapToResponse(ts);
    }

    @Transactional
    public TeamResponse updateTeam(String slug, UpdateTeamRequest request) {
        SeasonTeamEntity ts = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado"));

        if ("deleted".equals(ts.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede editar un equipo eliminado");
        }

        if (request.getName() != null && request.getName().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre no puede estar vacío");
        if (request.getImage() != null && request.getImage().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La imagen es obligatoria");

        if (request.getName() != null)
            ts.getTeam().setName(request.getName());
        if (request.getImage() != null)
            ts.getTeam().setImage(request.getImage());

        if (request.getSlug_coach() != null) {
            if (ts.getCoach() != null) {
                ts.getCoach().setTeam(null);
            }

            if (request.getSlug_coach().isBlank()) {
                ts.setCoach(null);
            } else {
                CoachEntity newCoach = coachRepository.findBySlug(request.getSlug_coach())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach no encontrado"));

                newCoach.setTeam(ts.getTeam());
                ts.setCoach(newCoach);
            }
        }

        if (request.getSlug_analyst() != null) {
            if (ts.getAnalyst() != null) {
                ts.getAnalyst().setTeam(null);
            }

            if (request.getSlug_analyst().isBlank()) {
                ts.setAnalyst(null);
            } else {
                AnalystEntity newAnalyst = analystRepository.findBySlug(request.getSlug_analyst())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Analista no encontrado"));

                newAnalyst.setTeam(ts.getTeam());
                ts.setAnalyst(newAnalyst);
            }
        }

        if (request.getSlug_venue() != null) {
            VenueEntity venue = venueRepository.findBySlug(request.getSlug_venue())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sede no encontrada"));
            ts.setVenue(venue);
        }

        if (request.getStatus() != null) {
            ts.setStatus(request.getStatus().toLowerCase());
            ts.setIsActive("active".equals(ts.getStatus()));
        }

        return mapToResponse(seasonTeamRepository.save(ts));
    }

    @Transactional
    public void deleteTeam(String slug) {
        SeasonTeamEntity ts = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado"));

        if ("deleted".equals(ts.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El equipo ya ha sido eliminado");
        }

        ts.setStatus("deleted");
        ts.setIsActive(false);

        seasonTeamRepository.save(ts);
    }

    private TeamResponse mapToResponse(SeasonTeamEntity ts) {
        return TeamResponse.builder()
                .slug_team(ts.getTeam().getSlug())
                .slug_league(ts.getLeague().getSlug())
                .slug_season(ts.getSeason().getName())
                .name(ts.getTeam().getName())
                .image(ts.getTeam().getImage())
                .status(ts.getStatus())
                .isActive(ts.getIsActive())
                .createdAt(ts.getCreatedAt())
                .slug_venue(ts.getVenue() != null ? ts.getVenue().getSlug() : null)
                .slug_coach(ts.getCoach() != null ? ts.getCoach().getSlug() : null)
                .slug_analist(ts.getAnalyst() != null ? ts.getAnalyst().getSlug() : null)
                .build();
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = name.toLowerCase()
                .trim()
                .replace(" ", "-")
                .replaceAll("[^a-z0-9-]", "");

        String finalSlug = baseSlug;
        int count = 1;

        while (teamRepository.findBySlug(finalSlug).isPresent()) {
            finalSlug = baseSlug + "-" + count;
            count++;
        }

        return finalSlug;
    }
}
package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.presentation.requests.team.*;
import com.vstats.vstats.presentation.responses.TeamResponse;
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
public class TeamService {

    private final TeamRepository teamRepository;
    private final SeasonTeamRepository seasonTeamRepository;
    private final SeasonRepository seasonRepository;
    private final LeagueRepository leagueRepository;
    private final VenueRepository venueRepository;
    private final CoachRepository coachRepository;
    private final AnalystRepository analystRepository;
    private final LeagueAdminRepository adminRepository;

    @Transactional
    public TeamResponse createTeam(CreateTeamRequest request) {
        SeasonEntity currentSeason = seasonRepository.findByIsActiveTrue()
            .orElseThrow(() -> new RuntimeException("No hay temporada activa"));
        
        LeagueEntity league = leagueRepository.findBySlug(request.getSlugLeague())
            .orElseThrow(() -> new RuntimeException("Liga no encontrada"));

        VenueEntity venue = venueRepository.findBySlug(request.getSlugVenue())
            .orElseThrow(() -> new RuntimeException("Sede no encontrada"));

        String slug = generateSlug(request.getName());
        TeamEntity team = teamRepository.findBySlug(slug)
            .orElseGet(() -> teamRepository.save(
                TeamEntity.builder().name(request.getName()).slug(slug).image(request.getImage()).build()
            ));

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

    public List<TeamResponse> getAllTeams() {
        return seasonTeamRepository.findAllBySeason_IsActiveTrue().stream()
            .filter(ts -> !"deleted".equals(ts.getStatus()))
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<TeamResponse> getTeamsByAdminSlug(String slugAdmin) {
        return seasonTeamRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(sl -> sl.getLeague().getIdAdmin().equals(getAdminIdBySlug(slugAdmin)))
                .filter(sl -> !"deleted".equals(sl.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TeamResponse getTeamBySlug(String slug) {
        SeasonTeamEntity ts = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(slug)
            .orElseThrow(() -> new RuntimeException("Equipo no encontrado en la temporada actual"));
        return mapToResponse(ts);
    }

    @Transactional
    public TeamResponse updateTeam(String slug, UpdateTeamRequest request) {
        SeasonTeamEntity ts = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(slug)
            .orElseThrow(() -> new RuntimeException("Equipo no encontrado para la temporada actual"));

        if (request.getName() != null) ts.getTeam().setName(request.getName());
        if (request.getImage() != null) ts.getTeam().setImage(request.getImage());

        if (request.getSlugVenue() != null) {
            VenueEntity venue = venueRepository.findBySlug(request.getSlugVenue())
                .orElseThrow(() -> new RuntimeException("Sede no encontrada"));
            ts.setVenue(venue);
        }

        if (request.getSlugCoach() != null) {
            CoachEntity coach = coachRepository.findBySlug(request.getSlugCoach())
                .orElseThrow(() -> new RuntimeException("Entrenador no encontrado"));
            ts.setCoach(coach);
        }

        if (request.getSlugAnalyst() != null) {
            AnalystEntity analyst = analystRepository.findBySlug(request.getSlugAnalyst())
                .orElseThrow(() -> new RuntimeException("Analista no encontrado"));
            ts.setAnalyst(analyst);
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
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
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

    private String getAdminIdBySlug(String slug) {
        return adminRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"))
                .getIdAdmin().toString();
    }

    private String generateSlug(String input) {
        String normalized = Normalizer.normalize(input.replaceAll("\\s", "-"), Normalizer.Form.NFD);
        return Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("").toLowerCase(Locale.ENGLISH);
    }
}
package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.CategoryEntity;
import com.vstats.vstats.domain.entities.LeagueEntity;
import com.vstats.vstats.domain.entities.TeamEntity;
import com.vstats.vstats.infrastructure.repositories.CategoryRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueRepository;
import com.vstats.vstats.infrastructure.repositories.TeamRepository;
import com.vstats.vstats.presentation.requests.TeamRequest;
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
    private final LeagueRepository leagueRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public TeamResponse createTeam(TeamRequest request) {
        LeagueEntity league = leagueRepository.findById(request.getIdLeague())
                .orElseThrow(() -> new RuntimeException("Liga no encontrada"));
        
        CategoryEntity category = categoryRepository.findById(request.getIdCategory())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        String slug = generateSlug(request.getName());

        TeamEntity team = TeamEntity.builder()
                .name(request.getName())
                .slug(slug)
                .image(request.getImage())
                .idCoach(request.getIdCoach())
                .idAnalyst(request.getIdAnalyst())
                .league(league)
                .category(category)
                .build();

        return mapToResponse(teamRepository.save(team));
    }

    public List<TeamResponse> getTeamsByLeague(Long idLeague) {
        return teamRepository.findAllByLeague_IdLeague(idLeague).stream()
                .filter(t -> !"deleted".equals(t.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TeamResponse getBySlug(String slug) {
        return teamRepository.findBySlug(slug)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
    }

    @Transactional
    public TeamResponse updateTeam(String slug, TeamRequest request) {
        TeamEntity team = teamRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        team.setName(request.getName());
        team.setImage(request.getImage());
        team.setIdCoach(request.getIdCoach());
        team.setIdAnalyst(request.getIdAnalyst());

        return mapToResponse(teamRepository.save(team));
    }

    @Transactional
    public void deleteTeam(String slug) {
        TeamEntity team = teamRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        team.setStatus("deleted");
        team.setIsActive(false);
        team.setBoxedAt(java.time.LocalDateTime.now());
        teamRepository.save(team);
    }

    private TeamResponse mapToResponse(TeamEntity entity) {
        return TeamResponse.builder()
                .slug(entity.getSlug())
                .name(entity.getName())
                .image(entity.getImage())
                .leagueName(entity.getLeague().getName())
                .categoryName(entity.getCategory().getName())
                .idCoach(entity.getIdCoach())
                .idAnalyst(entity.getIdAnalyst())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private String generateSlug(String input) {
        String nowhitespace = input.replaceAll("\\s", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.CategoryEntity;
import com.vstats.vstats.domain.entities.LeagueEntity;
import com.vstats.vstats.infrastructure.repositories.CategoryRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueRepository;
import com.vstats.vstats.presentation.requests.CreateLeagueRequest;
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
public class LeagueService {

    private final LeagueRepository leagueRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public LeagueResponse createLeague(CreateLeagueRequest request) {
        // 1. Buscamos la categoría
        CategoryEntity category = categoryRepository.findById(request.getIdCategory())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + request.getIdCategory()));

        // 2. Generamos slug y creamos entidad
        String slug = generateSlug(request.getName() + "-" + request.getSeason());
        
        LeagueEntity league = LeagueEntity.builder()
                .name(request.getName())
                .country(request.getCountry())
                .season(request.getSeason())
                .image(request.getImage())
                .idAdmin(request.getIdAdmin())
                .category(category)
                .slug(slug)
                .build();

        return mapToResponse(leagueRepository.save(league));
    }

    public List<LeagueResponse> getLeaguesByAdmin(String idAdmin) {
        return leagueRepository.findAllByIdAdmin(idAdmin).stream()
                .filter(l -> !"deleted".equals(l.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public LeagueResponse getBySlug(String slug) {
        return leagueRepository.findBySlug(slug)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Liga no encontrada"));
    }

    @Transactional
    public void deleteLeague(String slug) {
        LeagueEntity league = leagueRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Liga no encontrada"));
        league.setStatus("deleted");
        league.setIsActive(false);
        league.setBoxedAt(java.time.LocalDateTime.now());
        leagueRepository.save(league);
    }

    private LeagueResponse mapToResponse(LeagueEntity entity) {
        return LeagueResponse.builder()
                .slug(entity.getSlug())
                .name(entity.getName())
                .country(entity.getCountry())
                .season(entity.getSeason())
                .image(entity.getImage())
                .categoryName(entity.getCategory().getName())
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
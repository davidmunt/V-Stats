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
public class LeagueService {

    private final LeagueRepository leagueRepository;
    private final SeasonRepository seasonRepository;
    private final CategoryRepository categoryRepository;
    private final SeasonLeagueRepository seasonLeagueRepository;
    private final LeagueAdminRepository adminRepository;

    @Transactional
    public LeagueResponse createLeague(CreateLeagueRequest request) {
        LeagueAdminEntity admin = adminRepository.findBySlug(request.getSlugAdmin())
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        
        CategoryEntity category = categoryRepository.findBySlug(request.getSlugCategory())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        SeasonEntity currentSeason = seasonRepository.findByIsActiveTrue()
                .orElseThrow(() -> new RuntimeException("No hay una temporada activa configurada en el sistema"));

        String leagueSlug = generateSlug(request.getName());
        LeagueEntity league = leagueRepository.findBySlug(leagueSlug)
                .orElseGet(() -> leagueRepository.save(
                    LeagueEntity.builder()
                        .name(request.getName())
                        .slug(leagueSlug)
                        .country(request.getCountry())
                        .image(request.getImage())
                        .idAdmin(admin.getIdAdmin().toString())
                        .build()
                ));

        SeasonLeagueEntity seasonLeague = SeasonLeagueEntity.builder()
                .league(league)
                .season(currentSeason)
                .category(category)
                .status("active")
                .build();

        return mapToResponse(seasonLeagueRepository.save(seasonLeague));
    }

    public List<LeagueResponse> getAllLeagues() {
        return seasonLeagueRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(sl -> !"deleted".equals(sl.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<LeagueResponse> getLeaguesByAdminSlug(String slugAdmin) {
        return seasonLeagueRepository.findAllBySeason_IsActiveTrue().stream()
                .filter(sl -> sl.getLeague().getIdAdmin().equals(getAdminIdBySlug(slugAdmin)))
                .filter(sl -> !"deleted".equals(sl.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public LeagueResponse getLeagueBySlug(String slug) {
        SeasonLeagueEntity sl = seasonLeagueRepository.findByLeague_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Liga no encontrada para la temporada actual"));
        return mapToResponse(sl);
    }

    @Transactional
    public LeagueResponse updateLeague(String slug, UpdateLeagueRequest request) {
        SeasonLeagueEntity sl = seasonLeagueRepository.findByLeague_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Liga no encontrada"));

        sl.getLeague().setName(request.getName());
        sl.getLeague().setCountry(request.getCountry());
        sl.getLeague().setImage(request.getImage());

            CategoryEntity newCat = categoryRepository.findBySlug(request.getSlugCategory())
                    .orElseThrow(() -> new RuntimeException("Nueva categoría no encontrada"));
            sl.setCategory(newCat);

        if (request.getStatus() != null) {
            sl.setStatus(request.getStatus().toLowerCase());
        }

        return mapToResponse(seasonLeagueRepository.save(sl));
    }

    @Transactional
    public void deleteLeague(String slug) {
        SeasonLeagueEntity sl = seasonLeagueRepository.findByLeague_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Liga no encontrada"));
        sl.setStatus("deleted");
        seasonLeagueRepository.save(sl);
    }

    // --- Mapeo y Auxiliares ---

    private String getAdminIdBySlug(String slug) {
        return adminRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"))
                .getIdAdmin().toString();
    }

    private LeagueResponse mapToResponse(SeasonLeagueEntity sl) {
        return LeagueResponse.builder()
                .slug_league(sl.getLeague().getSlug())
                .slug_season(sl.getSeason().getName())
                .name(sl.getLeague().getName())
                .country(sl.getLeague().getCountry())
                .image(sl.getLeague().getImage())
                .categoryName(sl.getCategory().getName())
                .status(sl.getStatus())
                .isActive("active".equals(sl.getStatus()))
                .createdAt(sl.getCreatedAt())
                .build();
    }

    private String generateSlug(String input) {
        String nowhitespace = input.replaceAll("\\s", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        return Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("").toLowerCase(Locale.ENGLISH);
    }
}
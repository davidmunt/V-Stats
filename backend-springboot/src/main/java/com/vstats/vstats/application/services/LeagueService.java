package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.infrastructure.specs.LeagueSpecification;
import com.vstats.vstats.presentation.requests.league.CreateLeagueRequest;
import com.vstats.vstats.presentation.requests.league.UpdateLeagueRequest;
import com.vstats.vstats.presentation.responses.LeagueResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Administrador no encontrado"));

                CategoryEntity category = categoryRepository.findBySlug(request.getSlugCategory())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Categoría no encontrada"));

                SeasonEntity currentSeason = seasonRepository.findByIsActiveTrue()
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "No hay una temporada activa configurada en el sistema"));

                if (request.getName() == null || request.getName().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "El nombre de la liga es obligatorio");
                }
                if (request.getCountry() == null || request.getCountry().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El país de la liga es obligatorio");
                }
                if (request.getImage() == null || request.getImage().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La imagen de la liga es obligatoria");
                }

                String leagueSlug = generateUniqueSlug(request.getName());

                LeagueEntity league = LeagueEntity.builder()
                                .name(request.getName())
                                .slug(leagueSlug)
                                .country(request.getCountry())
                                .image(request.getImage())
                                .admin(admin)
                                .category(category)
                                .isActive(true)
                                .status("active")
                                .build();

                league = leagueRepository.save(league);

                SeasonLeagueEntity seasonLeague = SeasonLeagueEntity.builder()
                                .league(league)
                                .season(currentSeason)
                                .category(category)
                                .status("active")
                                .build();

                return mapToResponse(seasonLeagueRepository.save(seasonLeague));
        }

        public Map<String, Object> getAllLeagues(String q, String category, String status, String sort, int page,
                        int size) {

                Sort sortOrder = switch (sort != null ? sort : "recent") {
                        case "name_asc" -> Sort.by("league.name").ascending();
                        case "name_desc" -> Sort.by("league.name").descending();
                        case "oldest" -> Sort.by("createdAt").ascending();
                        default -> Sort.by("createdAt").descending();
                };

                Pageable pageable = PageRequest.of(page, size, sortOrder);
                Specification<SeasonLeagueEntity> spec = LeagueSpecification.build(q, category, status);

                Page<SeasonLeagueEntity> entitiesPage = seasonLeagueRepository.findAll(spec, pageable);

                List<LeagueResponse> leagues = entitiesPage.getContent().stream()
                                .map(this::mapToResponse)
                                .toList();

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("leagues", leagues);
                response.put("total", entitiesPage.getTotalElements());
                response.put("page", entitiesPage.getNumber());
                response.put("total_pages", entitiesPage.getTotalPages());
                response.put("sort", sort != null ? sort : "recent");
                response.put("filters_applied", Map.of(
                                "q", q != null ? q : "",
                                "category", category != null ? category : "",
                                "status", status != null ? status : ""));

                return response;
        }

        public LeagueResponse getLeagueBySlug(String slug) {
                SeasonLeagueEntity sl = seasonLeagueRepository.findByLeague_SlugAndSeason_IsActiveTrue(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Liga no encontrada"));
                return mapToResponse(sl);
        }

        @Transactional
        public LeagueResponse updateLeague(String slug, UpdateLeagueRequest request) {
                SeasonLeagueEntity sl = seasonLeagueRepository.findByLeague_SlugAndSeason_IsActiveTrue(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Liga no encontrada para la temporada actual"));

                if ("deleted".equals(sl.getStatus())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "No se puede editar una liga eliminada");
                }

                if (request.getName() == null || request.getName().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "El nombre de la liga es obligatorio");
                }
                if (request.getCountry() == null || request.getCountry().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El país es obligatorio");
                }
                if (request.getImage() == null || request.getImage().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La imagen de la liga es obligatoria");
                }
                if (request.getSlugCategory() == null || request.getSlugCategory().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "El slug de la categoría es obligatorio");
                }

                sl.getLeague().setName(request.getName());
                sl.getLeague().setCountry(request.getCountry());
                sl.getLeague().setImage(request.getImage());

                CategoryEntity newCat = categoryRepository.findBySlug(request.getSlugCategory())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Nueva categoría no encontrada: " + request.getSlugCategory()));

                sl.setCategory(newCat);
                sl.getLeague().setCategory(newCat);
                if (request.getStatus() != null && !request.getStatus().isBlank()) {
                        String newStatus = request.getStatus().toLowerCase().trim();

                        if ("deleted".equals(newStatus)) {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Para eliminar usa el método DELETE");
                        }

                        sl.setStatus(newStatus);
                        sl.getLeague().setStatus(newStatus);
                        sl.getLeague().setIsActive("active".equals(newStatus));
                }

                return mapToResponse(seasonLeagueRepository.save(sl));
        }

        @Transactional
        public void deleteLeague(String slug) {
                SeasonLeagueEntity sl = seasonLeagueRepository.findByLeague_SlugAndSeason_IsActiveTrue(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Liga no encontrada"));

                if ("deleted".equals(sl.getStatus())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La liga ya ha sido eliminada con anterioridad");
                }

                sl.setStatus("deleted");
                sl.getLeague().setStatus("deleted");
                sl.getLeague().setIsActive(false);
                sl.getLeague().setBoxedAt(java.time.LocalDateTime.now());

                seasonLeagueRepository.save(sl);
        }

        // --- Mapeo y Auxiliares ---

        private LeagueResponse mapToResponse(SeasonLeagueEntity sl) {
                return LeagueResponse.builder()
                                .slug_league(sl.getLeague().getSlug())
                                .slug_season(sl.getSeason().getName())
                                .slug_category(sl.getCategory().getSlug())
                                .name(sl.getLeague().getName())
                                .country(sl.getLeague().getCountry())
                                .image(sl.getLeague().getImage())
                                .status(sl.getStatus())
                                .isActive("active".equals(sl.getStatus()))
                                .createdAt(sl.getCreatedAt())
                                .build();
        }

        private String generateUniqueSlug(String name) {
                String baseSlug = name.toLowerCase()
                                .trim()
                                .replace(" ", "-")
                                .replaceAll("[^a-z0-9-]", "");

                String finalSlug = baseSlug;
                int count = 1;

                while (leagueRepository.findBySlug(finalSlug).isPresent()) {
                        finalSlug = baseSlug + "-" + count;
                        count++;
                }

                return finalSlug;
        }
}
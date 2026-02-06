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
import org.springframework.http.HttpStatus;

import java.util.List;
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
                                .idAdmin(admin.getIdAdmin().toString())
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

        // añadir lo del id de admin despues de crear el apartado del login
        public Page<LeagueResponse> getAllLeagues(String q, int page, int size) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
                Page<SeasonLeagueEntity> entities = seasonLeagueRepository.findAll(
                                LeagueSpecification.filterLeagues(q),
                                pageable);
                return entities.map(this::mapToResponse);
        }

        public List<LeagueResponse> getLeaguesByAdminSlug(String slugAdmin) {
                String adminId = getAdminIdBySlug(slugAdmin);
                return seasonLeagueRepository.findAllByLeague_IdAdminAndSeason_IsActiveTrue(adminId).stream()
                                .filter(sl -> !"deleted".equals(sl.getStatus()))
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
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
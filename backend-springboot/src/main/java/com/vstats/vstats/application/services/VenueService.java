package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.VenueEntity;
import com.vstats.vstats.domain.entities.LeagueAdminEntity;
import com.vstats.vstats.infrastructure.repositories.VenueRepository;
import com.vstats.vstats.infrastructure.specs.VenueSpecification;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.presentation.requests.venue.*;
import com.vstats.vstats.presentation.responses.VenueResponse;
import com.vstats.vstats.security.AuthUtils;

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

@Service
@RequiredArgsConstructor
public class VenueService {

        private final VenueRepository venueRepository;
        private final LeagueAdminRepository adminRepository;
        private final AuthUtils authUtils;

        @Transactional
        public VenueResponse createVenue(CreateVenueRequest request) {
                Long currentAdminId = authUtils.getCurrentUserId();
                LeagueAdminEntity admin = adminRepository.findById(currentAdminId)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Administrador no encontrado"));
                String slug = generateUniqueSlug(request.getName());

                if (request.getName() == null || request.getName().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "El nombre de la sede es obligatorio");
                }

                if (request.getAddress() == null || request.getAddress().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La direccion de la sede es obligatoria");
                }

                if (request.getCity() == null || request.getCity().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La ciudad de la sede es obligatoria");
                }

                if (request.getIndoor() == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tipo de pista es obligatorio");
                }

                if (request.getCapacity() != null && request.getCapacity() < 0) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La capacidad no puede ser negativa");
                }

                VenueEntity venue = VenueEntity.builder()
                                .name(request.getName())
                                .slug(slug)
                                .address(request.getAddress())
                                .city(request.getCity())
                                .capacity(request.getCapacity())
                                .indoor(request.getIndoor())
                                .admin(admin)
                                .isActive(true)
                                .status("active")
                                .build();

                return mapToResponse(venueRepository.save(venue));
        }

        // añadirle aqui lo del id de admin
        public Map<String, Object> getAllVenues(String q, String status, String sort, int page, int size) {

                Sort sortOrder = switch (sort != null ? sort : "recent") {
                        case "name_asc" -> Sort.by("name").ascending();
                        case "name_desc" -> Sort.by("name").descending();
                        case "oldest" -> Sort.by("createdAt").ascending();
                        default -> Sort.by("createdAt").descending();
                };

                Pageable pageable = PageRequest.of(page, size, sortOrder);
                Specification<VenueEntity> spec = VenueSpecification.build(q, status);

                Page<VenueEntity> entitiesPage = venueRepository.findAll(spec, pageable);

                List<VenueResponse> venues = entitiesPage.getContent().stream()
                                .map(this::mapToResponse)
                                .toList();

                Map<String, Object> response = new LinkedHashMap<>();
                response.put("venues", venues);
                response.put("total", entitiesPage.getTotalElements());
                response.put("page", entitiesPage.getNumber());
                response.put("total_pages", entitiesPage.getTotalPages());
                response.put("sort", sort != null ? sort : "recent");
                response.put("filters_applied", Map.of(
                                "q", q != null ? q : "",
                                "status", status != null ? status : ""));

                return response;
        }

        public VenueResponse getVenueBySlug(String slug) {
                VenueEntity venue = venueRepository.findBySlug(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Sede no encontrada"));

                return mapToResponse(venue);
        }

        @Transactional
        public VenueResponse updateVenue(String slug, UpdateVenueRequest request) {
                VenueEntity venue = venueRepository.findBySlug(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Sede no encontrada"));

                if (request.getName() != null && request.getName().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre no puede estar vacío");
                }

                if (request.getAddress() != null && request.getAddress().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La dirección no puede estar vacía");
                }

                if (request.getCity() != null && request.getCity().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La ciudad no puede estar vacía");
                }

                if (request.getIndoor() == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Debes especificar si la pista es interior o exterior");
                }

                if (request.getCapacity() != null && request.getCapacity() < 0) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La capacidad no puede ser negativa");
                }

                if (request.getStatus() != null && request.getStatus().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El estado no puede estar vacío");
                }

                if (request.getStatus() != null) {
                        String newStatus = request.getStatus().toLowerCase().trim();
                        venue.setStatus(newStatus);
                        venue.setIsActive("active".equals(newStatus));
                }

                venue.setName(request.getName());
                venue.setAddress(request.getAddress());
                venue.setCity(request.getCity());
                venue.setCapacity(request.getCapacity());
                venue.setIndoor(request.getIndoor());

                return mapToResponse(venueRepository.save(venue));
        }

        @Transactional
        public void deleteVenue(String slug) {
                VenueEntity venue = venueRepository.findBySlug(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Sede no encontrada"));

                if ("deleted".equals(venue.getStatus())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La sede ya ha sido eliminada con anterioridad");
                }

                venue.setIsActive(false);
                venue.setStatus("deleted");
                venueRepository.save(venue);
        }

        private VenueResponse mapToResponse(VenueEntity entity) {
                return VenueResponse.builder()
                                .name(entity.getName())
                                .slug_venue(entity.getSlug())
                                .city(entity.getCity())
                                .address(entity.getAddress())
                                .capacity(entity.getCapacity())
                                .indoor(entity.getIndoor())
                                .status(entity.getStatus())
                                .createdAt(entity.getCreatedAt())
                                .build();
        }

        private String generateUniqueSlug(String name) {
                String baseSlug = name.toLowerCase()
                                .trim()
                                .replace(" ", "-")
                                .replaceAll("[^a-z0-9-]", "");

                String finalSlug = baseSlug;
                int count = 1;

                while (venueRepository.findBySlug(finalSlug).isPresent()) {
                        finalSlug = baseSlug + "-" + count;
                        count++;
                }

                return finalSlug;
        }
}
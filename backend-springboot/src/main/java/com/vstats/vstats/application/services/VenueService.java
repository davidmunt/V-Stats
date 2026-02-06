package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.VenueEntity;
import com.vstats.vstats.domain.entities.LeagueAdminEntity;
import com.vstats.vstats.infrastructure.repositories.VenueRepository;
import com.vstats.vstats.infrastructure.specs.VenueSpecification;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.presentation.requests.venue.*;
import com.vstats.vstats.presentation.responses.VenueResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueService {

        private final VenueRepository venueRepository;
        private final LeagueAdminRepository adminRepository;

        @Transactional
        public VenueResponse createVenue(CreateVenueRequest request) {
                LeagueAdminEntity admin = adminRepository.findBySlug(request.getSlugAdmin())
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
                                .idAdmin(admin.getIdAdmin().toString())
                                .isActive(true)
                                .status("active")
                                .build();

                return mapToResponse(venueRepository.save(venue), admin.getSlug());
        }

        // añadirle aqui lo del id de admin
        public Page<VenueResponse> getAllVenues(String q, int page, int size) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
                Page<VenueEntity> venuePage = venueRepository.findAll(VenueSpecification.filterBy(q), pageable);
                return venuePage.map(v -> {
                        String adminSlug = adminRepository.findById(Long.parseLong(v.getIdAdmin()))
                                        .map(LeagueAdminEntity::getSlug)
                                        .orElse("unknown");
                        return mapToResponse(v, adminSlug);
                });
        }

        public List<VenueResponse> getVenuesByAdminSlug(String slugAdmin) {
                LeagueAdminEntity admin = adminRepository.findBySlug(slugAdmin)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Administrador no encontrado"));

                return venueRepository.findAllByIdAdmin(admin.getIdAdmin().toString()).stream()
                                .filter(v -> !"deleted".equals(v.getStatus()))
                                .map(v -> mapToResponse(v, slugAdmin))
                                .collect(Collectors.toList());
        }

        public VenueResponse getVenueBySlug(String slug) {
                VenueEntity venue = venueRepository.findBySlug(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Sede no encontrada"));

                String adminSlug = adminRepository.findById(Long.parseLong(venue.getIdAdmin()))
                                .map(LeagueAdminEntity::getSlug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Administrador no encontrado"));

                return mapToResponse(venue, adminSlug);
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

                String adminSlug = adminRepository.findById(Long.parseLong(venue.getIdAdmin()))
                                .map(LeagueAdminEntity::getSlug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Admin vinculado a la sede no encontrado"));

                return mapToResponse(venueRepository.save(venue), adminSlug);
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

        private VenueResponse mapToResponse(VenueEntity entity, String adminSlug) {
                return VenueResponse.builder()
                                .slug_venue(entity.getSlug())
                                .slug_admin(adminSlug)
                                .name(entity.getName())
                                .address(entity.getAddress())
                                .city(entity.getCity())
                                .capacity(entity.getCapacity())
                                .indoor(entity.getIndoor())
                                .isActive(entity.getIsActive())
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
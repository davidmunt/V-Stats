package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.VenueEntity;
import com.vstats.vstats.infrastructure.repositories.VenueRepository;
import com.vstats.vstats.presentation.requests.VenueRequest;
import com.vstats.vstats.presentation.responses.VenueResponse;
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
public class VenueService {

    private final VenueRepository venueRepository;

    @Transactional
    public VenueResponse createVenue(VenueRequest request) {
        String slug = generateSlug(request.getName());
        
        VenueEntity venue = VenueEntity.builder()
                .name(request.getName())
                .slug(slug)
                .address(request.getAddress())
                .city(request.getCity())
                .capacity(request.getCapacity())
                .indoor(request.getIndoor())
                .idAdmin(request.getIdAdmin())
                .isActive(true)
                .status("active")
                .build();

        return mapToResponse(venueRepository.save(venue));
    }

    public List<VenueResponse> getAllVenues() {
        return venueRepository.findAll().stream()
                .filter(v -> !"deleted".equals(v.getStatus())) // Opcional: no mostrar borrados
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public VenueResponse getVenueBySlug(String slug) {
        VenueEntity venue = venueRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Sede no encontrada con slug: " + slug));
        return mapToResponse(venue);
    }

    @Transactional
    public VenueResponse updateVenue(String slug, VenueRequest request) {
        VenueEntity venue = venueRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("No se puede actualizar, no existe: " + slug));

        venue.setName(request.getName());
        venue.setAddress(request.getAddress());
        venue.setCity(request.getCity());
        venue.setCapacity(request.getCapacity());
        venue.setIndoor(request.getIndoor());
        // El slug no lo solemos cambiar para no romper enlaces, pero podrías regenerarlo aquí.

        return mapToResponse(venueRepository.save(venue));
    }

    @Transactional
    public void deleteVenue(String slug) {
        VenueEntity venue = venueRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("No se puede borrar, no existe: " + slug));
        
        venue.setIsActive(false);
        venue.setStatus("deleted");
        venueRepository.save(venue);
    }

    private VenueResponse mapToResponse(VenueEntity entity) {
        return VenueResponse.builder()
                .idVenue(entity.getIdVenue())
                .slug(entity.getSlug())
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

    private String generateSlug(String input) {
        Pattern NONLATIN = Pattern.compile("[^\\w-]");
        Pattern WHITESPACE = Pattern.compile("[\\s]");
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
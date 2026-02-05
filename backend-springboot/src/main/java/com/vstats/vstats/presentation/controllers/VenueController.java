package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.venue.*;
import com.vstats.vstats.presentation.responses.VenueResponse;
import com.vstats.vstats.application.services.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    public ResponseEntity<Map<String, VenueResponse>> create(@RequestBody CreateVenueRequest request) {
        return new ResponseEntity<>(Map.of("venue", venueService.createVenue(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<VenueResponse> result = venueService.getAllVenues(q, page, size);
        
        return ResponseEntity.ok(Map.of(
            "venues", result.getContent(),
            "totalElements", result.getTotalElements(),
            "totalPages", result.getTotalPages(),
            "currentPage", result.getNumber()
        ));
    }

    @GetMapping("/admin/{slugAdmin}")
    public ResponseEntity<Map<String, List<VenueResponse>>> getByAdmin(@PathVariable String slugAdmin) {
        List<VenueResponse> venues = venueService.getVenuesByAdminSlug(slugAdmin);
        return ResponseEntity.ok(Map.of("venues", venues));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, VenueResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("venue", venueService.getVenueBySlug(slug)));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<Map<String, VenueResponse>> update(@PathVariable String slug, @RequestBody UpdateVenueRequest request) {
        return ResponseEntity.ok(Map.of("venue", venueService.updateVenue(slug, request)));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        venueService.deleteVenue(slug);
        return ResponseEntity.noContent().build();
    }
}
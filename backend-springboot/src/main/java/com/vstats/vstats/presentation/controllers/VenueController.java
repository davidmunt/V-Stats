package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.VenueRequest;
import com.vstats.vstats.presentation.responses.VenueResponse;
import com.vstats.vstats.application.services.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    public ResponseEntity<VenueResponse> createVenue(@RequestBody VenueRequest request) {
        return new ResponseEntity<>(venueService.createVenue(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<VenueResponse>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<VenueResponse> getVenueBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(venueService.getVenueBySlug(slug));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<VenueResponse> updateVenue(@PathVariable String slug, @RequestBody VenueRequest request) {
        return ResponseEntity.ok(venueService.updateVenue(slug, request));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> deleteVenue(@PathVariable String slug) {
        venueService.deleteVenue(slug);
        return ResponseEntity.noContent().build();
    }
}
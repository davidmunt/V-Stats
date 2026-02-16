package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.venue.*;
import com.vstats.vstats.presentation.responses.VenueResponse;
import com.vstats.vstats.security.authorization.CheckSecurity;
import com.vstats.vstats.application.services.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Map<String, VenueResponse>> create(@RequestBody CreateVenueRequest request) {
        return new ResponseEntity<>(Map.of("venue", venueService.createVenue(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVenues(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "recent") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(venueService.getAllVenues(q, status, sort, page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, VenueResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("venue", venueService.getVenueBySlug(slug)));
    }

    @PutMapping("/{slug}")
    @CheckSecurity.Venues.CanManage
    public ResponseEntity<Map<String, VenueResponse>> update(@PathVariable String slug,
            @RequestBody UpdateVenueRequest request) {
        return ResponseEntity.ok(Map.of("venue", venueService.updateVenue(slug, request)));
    }

    @DeleteMapping("/{slug}")
    @CheckSecurity.Venues.CanManage
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        venueService.deleteVenue(slug);
        return ResponseEntity.noContent().build();
    }
}
package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.application.services.LineupService;
import com.vstats.vstats.presentation.requests.lineup.CreateLineupRequest;
import com.vstats.vstats.presentation.requests.lineup.UpdateLineupRequest;
import com.vstats.vstats.presentation.responses.LineupResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lineups")
@RequiredArgsConstructor
public class LineupController {

    private final LineupService lineupService;

    // Crear alineación
    // POST /api/lineups/match-vobrnh/coach-coach2-zx9r
    @PostMapping("/{matchSlug}/{coachSlug}")
    public ResponseEntity<Map<String, LineupResponse>> create(
            @PathVariable String matchSlug,
            @PathVariable String coachSlug,
            @RequestBody CreateLineupRequest request) {
        
        return new ResponseEntity<>(
                Map.of("lineup", lineupService.createLineup(matchSlug, coachSlug, request)),
                HttpStatus.CREATED
        );
    }

    // Modificar alineación (Cambiar jugadores de posición)
    // PUT /api/lineups/match-vobrnh/coach-coach2-zx9r
    @PutMapping("/{matchSlug}/{coachSlug}")
    public ResponseEntity<Map<String, LineupResponse>> update(
            @PathVariable String matchSlug,
            @PathVariable String coachSlug,
            @RequestBody UpdateLineupRequest request) {
        
        return ResponseEntity.ok(
                Map.of("lineup", lineupService.updateLineup(matchSlug, coachSlug, request))
        );
    }
}
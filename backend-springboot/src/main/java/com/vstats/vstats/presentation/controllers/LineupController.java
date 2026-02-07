package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.lineup.*;
import com.vstats.vstats.presentation.responses.LineupResponse;
import com.vstats.vstats.presentation.responses.LineupsMatchResponse;
import com.vstats.vstats.application.services.LineupService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lineups")
@RequiredArgsConstructor
public class LineupController {

    private final LineupService lineupService;

    @PostMapping("/{slugMatch}")
    public ResponseEntity<Map<String, LineupResponse>> create(
            @PathVariable String slugMatch,
            @RequestBody CreateLineupRequest request) {
        // El coachId lo podrías sacar del token JWT más adelante, ahora simulamos uno
        Long coachId = 1234567890L;
        return new ResponseEntity<>(
                Map.of("lineup", lineupService.createLineup(request, slugMatch, coachId)),
                HttpStatus.CREATED);
    }

    @GetMapping("/match/{slugMatch}")
    public ResponseEntity<LineupsMatchResponse> getByMatch(@PathVariable String slugMatch) {
        return ResponseEntity.ok(lineupService.getLineupsByMatch(slugMatch));
    }

    @GetMapping("/{slugTeam}")
    public ResponseEntity<Map<String, LineupResponse>> getOne(@PathVariable String slugTeam) {
        return ResponseEntity.ok(Map.of("match", lineupService.getLineup(slugTeam)));
    }
}
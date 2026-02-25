package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.lineup.*;
import com.vstats.vstats.presentation.responses.LineupResponse;
import com.vstats.vstats.presentation.responses.LineupsMatchResponse;
import com.vstats.vstats.security.authorization.CheckSecurity;
import com.vstats.vstats.application.services.LineupService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('coach')")
    public ResponseEntity<Map<String, LineupResponse>> create(
            @PathVariable String slugMatch,
            @RequestBody CreateLineupRequest request) {
        return new ResponseEntity<>(
                Map.of("lineup", lineupService.createLineup(request, slugMatch)),
                HttpStatus.CREATED);
    }

    @GetMapping("/match/{slugMatch}")
    public ResponseEntity<LineupsMatchResponse> getByMatch(@PathVariable String slugMatch) {
        return ResponseEntity.ok(lineupService.getLineupsByMatch(slugMatch));
    }

    @GetMapping("/{slugMatch}/{slugTeam}")
    @PreAuthorize("hasRole('coach')")
    public ResponseEntity<Map<String, Object>> getOne(
            @PathVariable String slugMatch,
            @PathVariable String slugTeam) {

        LineupResponse data = lineupService.getLineup(slugMatch, slugTeam);

        if (data.getSlug() == null) {
            return ResponseEntity.ok(Map.of(
                    "lineup", Map.of(),
                    "positions", new ArrayList<>()));
        }

        return ResponseEntity.ok(Map.of(
                "lineup", data,
                "positions", data.getPositions()));
    }
}
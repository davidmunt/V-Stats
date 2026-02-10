package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.match.*;
import com.vstats.vstats.presentation.responses.MatchResponse;
import com.vstats.vstats.application.services.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping("/{slugLeague}")
    public ResponseEntity<Map<String, MatchResponse>> create(
            @PathVariable String slugLeague,
            @RequestBody CreateMatchRequest request) {
        // El adminId lo podrías sacar del token JWT más adelante, ahora simulamos uno
        Long adminId = 1L;
        // Simulamos un adminId como Long
        return new ResponseEntity<>(
                Map.of("match", matchService.createMatch(request, slugLeague, adminId)),
                HttpStatus.CREATED);
    }

    @PostMapping("/{slug}/start")
    public ResponseEntity<Map<String, MatchResponse>> start(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("match", matchService.startMatch(slug)));
    }

    // Partidos por liga
    @GetMapping("/league/{slugLeague}")
    public ResponseEntity<Map<String, List<MatchResponse>>> getByLeague(@PathVariable String slugLeague) {
        return ResponseEntity.ok(Map.of("matches", matchService.getMatchesByLeague(slugLeague)));
    }

    // Un solo partido
    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, MatchResponse>> getOne(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("match", matchService.getMatch(slug)));
    }

    // Partidos del equipo de un Coach
    @GetMapping("/coach/{slugCoach}")
    public ResponseEntity<Map<String, List<MatchResponse>>> getByCoach(@PathVariable String slugCoach) {
        return ResponseEntity.ok(Map.of("matches", matchService.getMatchesByCoach(slugCoach)));
    }

    // Partidos del equipo de un Analista
    @GetMapping("/analyst/{slugAnalyst}")
    public ResponseEntity<Map<String, List<MatchResponse>>> getByAnalyst(@PathVariable String slugAnalyst) {
        return ResponseEntity.ok(Map.of("matches", matchService.getMatchesByAnalyst(slugAnalyst)));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<Map<String, MatchResponse>> update(
            @PathVariable String slug,
            @RequestBody UpdateMatchRequest request) {
        return ResponseEntity.ok(Map.of("match", matchService.updateMatch(slug, request)));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        matchService.deleteMatch(slug);
        return ResponseEntity.noContent().build();
    }
}
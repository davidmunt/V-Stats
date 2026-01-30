package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.league.*;
import com.vstats.vstats.presentation.responses.LeagueResponse;
import com.vstats.vstats.application.services.LeagueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leagues")
@RequiredArgsConstructor
public class LeagueController {

    private final LeagueService leagueService;

    @PostMapping
    public ResponseEntity<Map<String, LeagueResponse>> create(@RequestBody CreateLeagueRequest request) {
        return new ResponseEntity<>(Map.of("league", leagueService.createLeague(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Map<String, List<LeagueResponse>>> getAll() {
        return ResponseEntity.ok(Map.of("leagues", leagueService.getAllLeagues()));
    }

    @GetMapping("/admin/{slugAdmin}")
    public ResponseEntity<Map<String, List<LeagueResponse>>> getByAdmin(@PathVariable String slugAdmin) {
        List<LeagueResponse> leagues = leagueService.getLeaguesByAdminSlug(slugAdmin);
        return ResponseEntity.ok(Map.of("leagues", leagues));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, LeagueResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("league", leagueService.getLeagueBySlug(slug)));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<Map<String, LeagueResponse>> update(@PathVariable String slug, @RequestBody UpdateLeagueRequest request) {
        return ResponseEntity.ok(Map.of("league", leagueService.updateLeague(slug, request)));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        leagueService.deleteLeague(slug);
        return ResponseEntity.noContent().build();
    }
}
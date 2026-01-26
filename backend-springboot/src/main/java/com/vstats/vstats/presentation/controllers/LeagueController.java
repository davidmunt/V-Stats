package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.CreateLeagueRequest;
import com.vstats.vstats.presentation.responses.LeagueResponse;
import com.vstats.vstats.application.services.LeagueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leagues")
@RequiredArgsConstructor
public class LeagueController {

    private final LeagueService leagueService;

    @PostMapping
    public ResponseEntity<LeagueResponse> create(@RequestBody CreateLeagueRequest request) {
        return new ResponseEntity<>(leagueService.createLeague(request), HttpStatus.CREATED);
    }

    @GetMapping("/admin/{idAdmin}")
    public ResponseEntity<List<LeagueResponse>> getByAdmin(@PathVariable String idAdmin) {
        return ResponseEntity.ok(leagueService.getLeaguesByAdmin(idAdmin));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<LeagueResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(leagueService.getBySlug(slug));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        leagueService.deleteLeague(slug);
        return ResponseEntity.noContent().build();
    }
}
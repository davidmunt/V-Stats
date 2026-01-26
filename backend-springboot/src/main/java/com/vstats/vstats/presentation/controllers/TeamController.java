package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.TeamRequest;
import com.vstats.vstats.presentation.responses.TeamResponse;
import com.vstats.vstats.application.services.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    public ResponseEntity<TeamResponse> create(@RequestBody TeamRequest request) {
        return new ResponseEntity<>(teamService.createTeam(request), HttpStatus.CREATED);
    }

    @GetMapping("/league/{idLeague}")
    public ResponseEntity<List<TeamResponse>> getByLeague(@PathVariable Long idLeague) {
        return ResponseEntity.ok(teamService.getTeamsByLeague(idLeague));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<TeamResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(teamService.getBySlug(slug));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<TeamResponse> update(@PathVariable String slug, @RequestBody TeamRequest request) {
        return ResponseEntity.ok(teamService.updateTeam(slug, request));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        teamService.deleteTeam(slug);
        return ResponseEntity.noContent().build();
    }
}
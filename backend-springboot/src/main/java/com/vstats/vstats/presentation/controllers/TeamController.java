package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.team.*;
import com.vstats.vstats.presentation.responses.TeamResponse;
import com.vstats.vstats.security.authorization.CheckSecurity;
import com.vstats.vstats.application.services.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Map<String, TeamResponse>> create(@RequestBody CreateTeamRequest request) {
        return new ResponseEntity<>(Map.of("team", teamService.createTeam(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTeams(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = true) String slug_league,
            @RequestParam(defaultValue = "recent") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(teamService.getAllTeams(q, status, slug_league, sort, page, size));
    }

    @GetMapping("/league/{slugLeague}")
    public ResponseEntity<Map<String, List<TeamResponse>>> getByLeague(@PathVariable String slugLeague) {
        List<TeamResponse> teams = teamService.getTeamsByLeagueSlug(slugLeague);
        return ResponseEntity.ok(Map.of("teams", teams));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, TeamResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("team", teamService.getTeamBySlug(slug)));
    }

    @PutMapping("/{slug}")
    @CheckSecurity.Teams.CanManage
    public ResponseEntity<Map<String, TeamResponse>> update(@PathVariable String slug,
            @RequestBody UpdateTeamRequest request) {
        return ResponseEntity.ok(Map.of("team", teamService.updateTeam(slug, request)));
    }

    @DeleteMapping("/{slug}")
    @CheckSecurity.Teams.CanManage
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        teamService.deleteTeam(slug);
        return ResponseEntity.noContent().build();
    }
}
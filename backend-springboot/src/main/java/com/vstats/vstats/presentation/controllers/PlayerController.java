package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.application.services.PlayerService;
import com.vstats.vstats.presentation.requests.player.CreatePlayerRequest;
import com.vstats.vstats.presentation.requests.player.UpdatePlayerRequest;
import com.vstats.vstats.presentation.responses.PlayerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping
    public ResponseEntity<Map<String, PlayerResponse>> create(@RequestBody CreatePlayerRequest request) {
        return new ResponseEntity<>(
            Map.of("player", playerService.createPlayer(request)), 
            HttpStatus.CREATED
        );
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, PlayerResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("player", playerService.getPlayerBySlug(slug)));
    }

    @GetMapping("/team/{slugTeam}")
    public ResponseEntity<Map<String, List<PlayerResponse>>> getByTeam(@PathVariable String slugTeam) {
        return ResponseEntity.ok(Map.of("players", playerService.getPlayersByTeam(slugTeam)));
    }

    @GetMapping("/coach/{slugCoach}")
    public ResponseEntity<Map<String, List<PlayerResponse>>> getByCoach(@PathVariable String slugCoach) {
        return ResponseEntity.ok(Map.of("players", playerService.getPlayersByCoach(slugCoach)));
    }

    @GetMapping("/analyst/{slugAnalyst}")
    public ResponseEntity<Map<String, List<PlayerResponse>>> getByAnalyst(@PathVariable String slugAnalyst) {
        return ResponseEntity.ok(Map.of("players", playerService.getPlayersByAnalyst(slugAnalyst)));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<Map<String, PlayerResponse>> update(
            @PathVariable String slug, 
            @RequestBody UpdatePlayerRequest request) {
        return ResponseEntity.ok(Map.of("player", playerService.updatePlayer(slug, request)));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        playerService.deletePlayer(slug);
        return ResponseEntity.noContent().build();
    }
}
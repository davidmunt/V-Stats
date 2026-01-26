package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.PlayerRequest;
import com.vstats.vstats.presentation.responses.PlayerResponse;
import com.vstats.vstats.application.services.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping
    public ResponseEntity<PlayerResponse> create(@RequestBody PlayerRequest request) {
        return new ResponseEntity<>(playerService.createPlayer(request), HttpStatus.CREATED);
    }

    @GetMapping("/team/{idTeam}")
    public ResponseEntity<List<PlayerResponse>> getByTeam(@PathVariable String idTeam) {
        return ResponseEntity.ok(playerService.getPlayersByTeam(idTeam));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PlayerResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(playerService.getBySlug(slug));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<PlayerResponse> update(@PathVariable String slug, @RequestBody PlayerRequest request) {
        return ResponseEntity.ok(playerService.updatePlayer(slug, request));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        playerService.deletePlayer(slug);
        return ResponseEntity.noContent().build();
    }
}
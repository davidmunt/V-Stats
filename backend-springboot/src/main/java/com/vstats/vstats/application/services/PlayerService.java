package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.PlayerEntity;
import com.vstats.vstats.infrastructure.repositories.PlayerRepository;
import com.vstats.vstats.presentation.requests.PlayerRequest;
import com.vstats.vstats.presentation.responses.PlayerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Transactional
    public PlayerResponse createPlayer(PlayerRequest request) {
        // Slug único: nombre + dorsal
        String slug = generateSlug(request.getName() + "-" + request.getDorsal());
        
        PlayerEntity player = PlayerEntity.builder()
                .name(request.getName())
                .slug(slug)
                .dorsal(request.getDorsal())
                .role(request.getRole())
                .idTeam(request.getIdTeam())
                .email(request.getEmail())
                .avatar(request.getAvatar())
                .build();

        return mapToResponse(playerRepository.save(player));
    }

    public List<PlayerResponse> getPlayersByTeam(String idTeam) {
        return playerRepository.findAllByIdTeam(idTeam).stream()
                .filter(p -> !"deleted".equals(p.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PlayerResponse getBySlug(String slug) {
        return playerRepository.findBySlug(slug)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));
    }

    @Transactional
    public PlayerResponse updatePlayer(String slug, PlayerRequest request) {
        PlayerEntity player = playerRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        player.setName(request.getName());
        player.setDorsal(request.getDorsal());
        player.setRole(request.getRole());
        player.setAvatar(request.getAvatar());

        return mapToResponse(playerRepository.save(player));
    }

    @Transactional
    public void deletePlayer(String slug) {
        PlayerEntity player = playerRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));
        player.setStatus("deleted");
        player.setIsActive(false);
        player.setBoxedAt(java.time.LocalDateTime.now());
        playerRepository.save(player);
    }

    private PlayerResponse mapToResponse(PlayerEntity entity) {
        return PlayerResponse.builder()
                .slug(entity.getSlug())
                .name(entity.getName())
                .dorsal(entity.getDorsal())
                .role(entity.getRole())
                .idTeam(entity.getIdTeam())
                .email(entity.getEmail())
                .avatar(entity.getAvatar())
                .status(entity.getStatus())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private String generateSlug(String input) {
        String nowhitespace = input.replaceAll("\\s", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
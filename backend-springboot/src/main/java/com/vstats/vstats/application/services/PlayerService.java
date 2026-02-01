package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.presentation.requests.player.*;
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
    private final SeasonPlayerRepository seasonPlayerRepository;
    private final CoachRepository coachRepository;
    private final AnalystRepository analystRepository;
    private final SeasonRepository seasonRepository;
    private final SeasonTeamRepository seasonTeamRepository;

    @Transactional
    public PlayerResponse createPlayer(CreatePlayerRequest request) {
        // Controles de errores iniciales
        validateRequest(request.getName(), request.getEmail(), request.getDorsal(), request.getRole());

        SeasonEntity currentSeason = seasonRepository.findByIsActiveTrue()
                .orElseThrow(() -> new RuntimeException("No hay temporada activa"));

        SeasonTeamEntity seasonTeam = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(request.getSlugTeam())
                .orElseThrow(() -> new RuntimeException("El equipo no existe en la temporada actual"));

        String slug = generateSlug(request.getName());
        
        // Identidad: Si el email ya existe en otro slug, mejor avisar (Control extra)
        playerRepository.findByEmail(request.getEmail()).ifPresent(p -> {
            if(!p.getSlug().equals(slug)) throw new RuntimeException("El email ya está registrado");
        });

        PlayerEntity player = playerRepository.findBySlug(slug)
                .orElseGet(() -> playerRepository.save(
                    PlayerEntity.builder()
                        .name(request.getName())
                        .slug(slug)
                        .email(request.getEmail())
                        .avatar(request.getAvatar())
                        .build()
                ));

        SeasonPlayerEntity seasonPlayer = SeasonPlayerEntity.builder()
                .player(player)
                .seasonTeam(seasonTeam)
                .season(currentSeason)
                .dorsal(request.getDorsal())
                .role(request.getRole())
                .status("active")
                .isActive(true)
                .build();

        return mapToResponse(seasonPlayerRepository.save(seasonPlayer));
    }

    // 1. Obtener jugador por su slug (Individual)
    public PlayerResponse getPlayerBySlug(String playerSlug) {
        return seasonPlayerRepository.findByPlayer_SlugAndSeason_IsActiveTrue(playerSlug)
                .filter(sp -> !"deleted".equals(sp.getStatus()))
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Error: Jugador no encontrado o no está activo en la temporada actual."));
    }

    // 2. Obtener todos los jugadores de un equipo (slugTeam)
    public List<PlayerResponse> getPlayersByTeam(String slugTeam) {
        List<SeasonPlayerEntity> players = seasonPlayerRepository.findAllBySeasonTeam_Team_SlugAndSeason_IsActiveTrue(slugTeam);
        
        return players.stream()
                .filter(sp -> !"deleted".equals(sp.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 3. Obtener jugadores del equipo vinculado a un Coach (slugCoach)
    public List<PlayerResponse> getPlayersByCoach(String slugCoach) {
        // Primero verificamos si el coach existe (opcional, pero da mejores errores)
        if (!coachRepository.existsBySlug(slugCoach)) {
            throw new RuntimeException("Error: El entrenador con slug '" + slugCoach + "' no existe.");
        }

        return seasonPlayerRepository.findAllBySeasonTeam_Coach_SlugAndSeason_IsActiveTrue(slugCoach).stream()
                .filter(sp -> !"deleted".equals(sp.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 4. Obtener jugadores del equipo vinculado a un Analyst (slugAnalyst)
    public List<PlayerResponse> getPlayersByAnalyst(String slugAnalyst) {
        // Verificamos si el analista existe
        if (!analystRepository.existsBySlug(slugAnalyst)) {
            throw new RuntimeException("Error: El analista con slug '" + slugAnalyst + "' no existe.");
        }

        return seasonPlayerRepository.findAllBySeasonTeam_Analyst_SlugAndSeason_IsActiveTrue(slugAnalyst).stream()
                .filter(sp -> !"deleted".equals(sp.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlayerResponse updatePlayer(String slug, UpdatePlayerRequest request) {
        SeasonPlayerEntity sp = seasonPlayerRepository.findByPlayer_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado en esta temporada"));

        // Validaciones: que no vengan vacíos
        validateRequest(request.getName(), request.getEmail(), request.getDorsal(), request.getRole());

        // Actualizar Identidad (Humano)
        PlayerEntity p = sp.getPlayer();
        p.setName(request.getName());
        p.setEmail(request.getEmail());
        if (request.getAvatar() != null) p.setAvatar(request.getAvatar());

        // Actualizar Ficha de Temporada
        sp.setDorsal(request.getDorsal());
        sp.setRole(request.getRole());
        
        if (request.getStatus() != null) {
            String newStatus = request.getStatus().toLowerCase();
            sp.setStatus(newStatus);
            // Si el status es 'active' es true, si no (deleted, inactive, etc), es false
            sp.setIsActive(newStatus.equals("active"));
        }

        return mapToResponse(seasonPlayerRepository.save(sp));
    }

    @Transactional
    public void deletePlayer(String slug) {
        SeasonPlayerEntity sp = seasonPlayerRepository.findByPlayer_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new RuntimeException("Jugador no encontrado"));

        // Soft delete en temporada
        sp.setStatus("deleted");
        sp.setIsActive(false);
        
        // Soft delete en identidad global
        sp.getPlayer().setStatus("deleted");
        sp.getPlayer().setIsActive(false);

        seasonPlayerRepository.save(sp);
    }

    // --- Auxiliares de Validación ---

    private void validateRequest(String name, String email, Integer dorsal, String role) {
        if (name == null || name.trim().length() < 3) 
            throw new RuntimeException("El nombre debe tener al menos 3 caracteres");
        
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) 
            throw new RuntimeException("El formato del email no es válido");
            
        if (dorsal == null || dorsal < 0 || dorsal > 99) 
            throw new RuntimeException("El dorsal debe ser un número entre 0 y 99");
            
        if (role == null || role.trim().isEmpty()) 
            throw new RuntimeException("El rol del jugador no puede estar vacío");
    }

    private String generateSlug(String input) {
        String normalized = Normalizer.normalize(input.replaceAll("\\s", "-"), Normalizer.Form.NFD);
        return Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("").toLowerCase(Locale.ENGLISH);
    }

    private PlayerResponse mapToResponse(SeasonPlayerEntity sp) {
        return PlayerResponse.builder()
                .slug_player(sp.getPlayer().getSlug())
                .slug_team(sp.getSeasonTeam().getTeam().getSlug())
                .slug_season(sp.getSeason().getName())
                .name(sp.getPlayer().getName())
                .email(sp.getPlayer().getEmail())
                .dorsal(sp.getDorsal().toString())
                .role(sp.getRole())
                .avatar(sp.getPlayer().getAvatar())
                .isActive(sp.getIsActive())
                .createdAt(sp.getPlayer().getCreatedAt())
                .build();
    }
}
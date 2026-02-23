package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.*;
import com.vstats.vstats.infrastructure.repositories.*;
import com.vstats.vstats.infrastructure.specs.PlayerSpecification;
import com.vstats.vstats.presentation.requests.player.*;
import com.vstats.vstats.presentation.responses.PlayerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
    private final TeamRepository teamRepository;

    @Transactional
    public PlayerResponse createPlayer(CreatePlayerRequest request) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        if (request.getDorsal() != null && request.getDorsal() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El dorsal no puede ser negativo");
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            playerRepository.findByEmail(request.getEmail()).ifPresent(other -> {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El email ya está registrado por otro jugador");
            });
        }

        SeasonEntity currentSeason = seasonRepository.findByIsActiveTrue()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No hay temporada activa"));

        SeasonTeamEntity seasonTeam = seasonTeamRepository.findByTeam_SlugAndSeason_IsActiveTrue(request.getSlug_team())
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El equipo no compite esta temporada"));

        if (seasonPlayerRepository.existsByPlayer_SlugAndSeason_IdSeason(generateUniqueSlug(request.getName()),
                currentSeason.getIdSeason())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El jugador ya está inscrito en esta temporada");
        }

        String slug = generateUniqueSlug(request.getName());
        PlayerEntity player = playerRepository.findBySlug(slug)
                .orElseGet(() -> playerRepository.save(
                        PlayerEntity.builder()
                                .name(request.getName())
                                .slug(slug)
                                .email(request.getEmail())
                                .avatar(request.getAvatar())
                                .status("active")
                                .isActive(true)
                                .build()));

        SeasonPlayerEntity seasonPlayer = SeasonPlayerEntity.builder()
                .player(player)
                .seasonTeam(seasonTeam)
                .season(currentSeason)
                .dorsal(request.getDorsal())
                .role(request.getRole() != null ? request.getRole() : "PLAYER")
                .status("active")
                .isActive(true)
                .build();

        return mapToResponse(seasonPlayerRepository.save(seasonPlayer));
    }

    public PlayerResponse getPlayerBySlug(String playerSlug) {
        return seasonPlayerRepository.findByPlayer_SlugAndSeason_IsActiveTrue(playerSlug)
                .filter(sp -> !"deleted".equals(sp.getStatus()))
                .map(this::mapToResponse)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No se ha encontrado a ese jugador"));
    }

    public Map<String, Object> getAllPlayers(String q, String status, String slug_team, String sort, int page,
            int size) {

        TeamEntity team = teamRepository.findBySlug(slug_team)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipo no encontrado"));

        Sort sortOrder = switch (sort != null ? sort : "recent") {
            case "name_asc" -> Sort.by("player.name").ascending(); // Ordena por el nombre del chaval
            case "dorsal" -> Sort.by("dorsal").ascending(); // Ordena por número
            default -> Sort.by("createdAt").descending();
        };

        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Specification<SeasonPlayerEntity> spec = PlayerSpecification.build(q, team.getIdTeam(), status);

        Page<SeasonPlayerEntity> entitiesPage = seasonPlayerRepository.findAll(spec, pageable);

        List<PlayerResponse> players = entitiesPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("players", players);
        response.put("total", entitiesPage.getTotalElements());
        response.put("page", entitiesPage.getNumber());
        response.put("total_pages", entitiesPage.getTotalPages());
        response.put("filters_applied", Map.of("q", q != null ? q : "", "team", slug_team));

        return response;
    }

    public List<PlayerResponse> getPlayersByCoach(String slugCoach) {
        if (!coachRepository.existsBySlug(slugCoach)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Coach no encontrado");
        }

        return seasonPlayerRepository.findAllBySeasonTeam_Coach_SlugAndSeason_IsActiveTrue(slugCoach).stream()
                .filter(sp -> !"deleted".equals(sp.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PlayerResponse> getPlayersByAnalyst(String slugAnalyst) {
        if (!analystRepository.existsBySlug(slugAnalyst)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Analista no encontrado");
        }

        return seasonPlayerRepository.findAllBySeasonTeam_Analyst_SlugAndSeason_IsActiveTrue(slugAnalyst).stream()
                .filter(sp -> !"deleted".equals(sp.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlayerResponse updatePlayer(String slug, UpdatePlayerRequest request) {
        SeasonPlayerEntity sp = seasonPlayerRepository.findByPlayer_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Jugador no encontrado en la temporada actual"));

        if ("deleted".equals(sp.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se puede editar un jugador eliminado");
        }

        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
        }
        if (request.getDorsal() != null && request.getDorsal() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El dorsal no puede ser negativo");
        }

        if (request.getEmail() != null && !request.getEmail().equals(sp.getPlayer().getEmail())) {
            playerRepository.findByEmail(request.getEmail()).ifPresent(other -> {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El email ya está registrado por otro jugador");
            });
        }

        PlayerEntity p = sp.getPlayer();
        p.setName(request.getName());
        p.setEmail(request.getEmail());
        if (request.getAvatar() != null)
            p.setAvatar(request.getAvatar());

        sp.setDorsal(request.getDorsal());
        sp.setRole(request.getRole());

        if (request.getStatus() != null) {
            String newStatus = request.getStatus().toLowerCase().trim();
            if ("deleted".equals(newStatus)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usa el método DELETE para eliminar");
            }
            sp.setStatus(newStatus);
            sp.setIsActive("active".equals(newStatus));
        }

        return mapToResponse(seasonPlayerRepository.save(sp));
    }

    @Transactional
    public void deletePlayer(String slug) {
        SeasonPlayerEntity sp = seasonPlayerRepository.findByPlayer_SlugAndSeason_IsActiveTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Jugador no encontrado"));

        if ("deleted".equals(sp.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El jugador ya ha sido eliminado previamente");
        }

        sp.setStatus("deleted");
        sp.setIsActive(false);

        sp.getPlayer().setStatus("deleted");
        sp.getPlayer().setIsActive(false);

        seasonPlayerRepository.save(sp);
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

    private String generateUniqueSlug(String name) {
        String baseSlug = name.toLowerCase()
                .trim()
                .replace(" ", "-")
                .replaceAll("[^a-z0-9-]", "");

        String finalSlug = baseSlug;
        int count = 1;

        while (playerRepository.findBySlug(finalSlug).isPresent()) {
            finalSlug = baseSlug + "-" + count;
            count++;
        }

        return finalSlug;
    }
}
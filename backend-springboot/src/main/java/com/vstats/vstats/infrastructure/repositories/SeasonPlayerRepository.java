package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.SeasonPlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeasonPlayerRepository extends JpaRepository<SeasonPlayerEntity, Long> {

    // Buscar por el slug del jugador en la temporada activa
    Optional<SeasonPlayerEntity> findByPlayer_SlugAndSeason_IsActiveTrue(String playerSlug);

    // Buscar jugadores de un equipo específico
    List<SeasonPlayerEntity> findAllBySeasonTeam_Team_SlugAndSeason_IsActiveTrue(String teamSlug);

    // Buscar jugadores por el equipo donde está un Coach específico
    List<SeasonPlayerEntity> findAllBySeasonTeam_Coach_SlugAndSeason_IsActiveTrue(String coachSlug);

    // Buscar jugadores por el equipo donde está un Analyst específico
    List<SeasonPlayerEntity> findAllBySeasonTeam_Analyst_SlugAndSeason_IsActiveTrue(String analystSlug);
}
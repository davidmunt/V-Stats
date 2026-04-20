package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.SeasonPlayerEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeasonPlayerRepository
                extends JpaRepository<SeasonPlayerEntity, Long>, JpaSpecificationExecutor<SeasonPlayerEntity> {

        Optional<SeasonPlayerEntity> findByPlayer_Slug(String slug);

        boolean existsByPlayer_SlugAndSeason_IdSeason(String slug, Long idSeason);

        boolean existsByDorsalAndSeasonTeam_Team_Slug(Integer dorsal, String teamSlug);

        boolean existsByDorsalAndSeasonTeam_IdTeamSeasonAndIdSeasonPlayerNot(Integer dorsal, Long idTeamSeason,
                        Long idSeasonPlayer);

        Optional<SeasonPlayerEntity> findByPlayer_SlugAndSeason_IsActiveTrue(String playerSlug);

        List<SeasonPlayerEntity> findAllBySeasonTeam_Team_SlugAndSeason_IsActiveTrue(String teamSlug);

        List<SeasonPlayerEntity> findAllBySeasonTeam_Coach_SlugAndSeason_IsActiveTrue(String coachSlug);

        List<SeasonPlayerEntity> findAllBySeasonTeam_Analyst_SlugAndSeason_IsActiveTrue(String analystSlug);

        Optional<SeasonPlayerEntity> findByPlayer_IdPlayerAndSeason_IsActiveTrue(Long idPlayer);
}
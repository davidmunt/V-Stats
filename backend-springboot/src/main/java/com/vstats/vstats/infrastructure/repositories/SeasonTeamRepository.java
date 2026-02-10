package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.SeasonTeamEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeasonTeamRepository
        extends JpaRepository<SeasonTeamEntity, Long>, JpaSpecificationExecutor<SeasonTeamEntity> {
    List<SeasonTeamEntity> findAllBySeason_IsActiveTrue();

    Optional<SeasonTeamEntity> findByTeam_SlugAndSeason_IsActiveTrue(String slug);

    Optional<SeasonTeamEntity> findByTeam_IdTeamAndSeason_IdSeason(Long idTeam, Long idSeason);

    List<SeasonTeamEntity> findAllByLeague_Admin_IdAdminAndSeason_IsActiveTrue(Long idAdmin);

    List<SeasonTeamEntity> findAllByLeague_SlugAndSeason_IsActiveTrue(String leagueSlug);
}
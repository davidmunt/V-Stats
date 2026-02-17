package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LeagueEntity;
import com.vstats.vstats.domain.entities.SeasonEntity;
import com.vstats.vstats.domain.entities.SeasonLeagueEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeasonLeagueRepository
        extends JpaRepository<SeasonLeagueEntity, Long>, JpaSpecificationExecutor<SeasonLeagueEntity> {
    Optional<SeasonLeagueEntity> findByLeague_Slug(String slug);

    Optional<SeasonLeagueEntity> findByLeagueAndSeason(LeagueEntity league, SeasonEntity season);

    List<SeasonLeagueEntity> findAllBySeason_IsActiveTrue();

    Optional<SeasonLeagueEntity> findByLeague_SlugAndSeason_IsActiveTrue(String slug);

    Optional<SeasonLeagueEntity> findByLeague_IdLeagueAndSeason_IdSeason(Long idLeague, Long idSeason);

    // Cambia el nombre a este:
    List<SeasonLeagueEntity> findAllByLeague_Admin_IdAdminAndSeason_IsActiveTrue(Long idAdmin);
}
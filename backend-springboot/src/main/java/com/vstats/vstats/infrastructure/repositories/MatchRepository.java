package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.MatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, Long> {
    Optional<MatchEntity> findBySlug(String slug);

    List<MatchEntity> findAllByLeague_SlugAndIsActiveTrue(String leagueSlug);

    List<MatchEntity> findAllByLocalTeam_SlugOrVisitorTeam_Slug(String localSlug, String visitorSlug);

    List<MatchEntity> findAllByLocalTeam_IdTeamOrVisitorTeam_IdTeam(Long localId, Long visitorId);

    List<MatchEntity> findByLeague_IdLeague(Long idLeague);

    List<MatchEntity> findAllByLeague_IdLeague(Long idLeague);
}
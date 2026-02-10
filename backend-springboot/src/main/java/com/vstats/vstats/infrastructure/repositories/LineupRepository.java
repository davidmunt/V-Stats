package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LineupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LineupRepository extends JpaRepository<LineupEntity, Long> {
    Optional<LineupEntity> findByMatch_IdMatch(Long idMatch);

    Optional<LineupEntity> findByMatch_IdMatchAndTeam_IdTeam(Long matchId, Long idTeam);

    Optional<LineupEntity> findByMatch_SlugAndTeam_IdTeam(String matchSlug, Long idTeam);
}

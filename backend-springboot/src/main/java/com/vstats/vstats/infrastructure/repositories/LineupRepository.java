package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LineupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LineupRepository extends JpaRepository<LineupEntity, Long> {
    Optional<LineupEntity> findByMatchId(String slug);

    Optional<LineupEntity> findByMatch_IdAndIdTeam(Long idMatch, Long idTeam);

    Optional<LineupEntity> findByMatch_SlugAndIdTeam(String slugMatch, String idTeam);
}

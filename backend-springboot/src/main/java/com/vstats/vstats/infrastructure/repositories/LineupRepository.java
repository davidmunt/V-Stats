package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LineupEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LineupRepository extends JpaRepository<LineupEntity, Long> {
    // Buscar la alineación de un equipo específico en un partido concreto
    Optional<LineupEntity> findByMatch_SlugAndIdTeam(String matchSlug, String teamId);
}
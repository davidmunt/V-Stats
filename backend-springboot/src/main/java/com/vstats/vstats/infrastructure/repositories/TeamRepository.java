package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, Long> {
    Optional<TeamEntity> findBySlug(String slug);
    // Buscar equipos por liga
    List<TeamEntity> findAllByLeague_IdLeague(Long idLeague);
    // Buscar equipos donde un coach o analista esté asignado
    List<TeamEntity> findAllByIdCoach(String idCoach);
    List<TeamEntity> findAllByIdAnalyst(String idAnalyst);
}
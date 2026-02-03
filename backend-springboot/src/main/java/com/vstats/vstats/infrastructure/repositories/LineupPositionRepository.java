package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LineupPositionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LineupPositionRepository extends JpaRepository<LineupPositionEntity, Long> {
    // Borrar posiciones antiguas al actualizar (si prefieres recrearlas) o buscarlas
    void deleteByLineup_IdLineup(Long idLineup);
    List<LineupPositionEntity> findAllByLineup_Slug(String lineupSlug);
}
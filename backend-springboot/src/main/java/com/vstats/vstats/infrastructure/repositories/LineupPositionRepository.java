package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LineupPositionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LineupPositionRepository extends JpaRepository<LineupPositionEntity, Long> {

    List<LineupPositionEntity> findByLineup_IdLineup(Long idLineup);

    void deleteByLineup_IdLineup(Long idLineup);

    // Busca todas las posiciones asociadas a una alineación específica
    List<LineupPositionEntity> findAllByLineup_IdLineup(Long idLineup);
}
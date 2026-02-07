package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LineupPositionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LineupPositionRepository extends JpaRepository<LineupPositionEntity, Long> {

    List<LineupPositionEntity> findByLineupId(Long id);

    void deleteByLineupId(Long id);
}
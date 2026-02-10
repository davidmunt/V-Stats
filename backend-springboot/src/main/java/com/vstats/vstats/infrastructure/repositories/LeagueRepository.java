package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LeagueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeagueRepository extends JpaRepository<LeagueEntity, Long> {
    Optional<LeagueEntity> findBySlug(String slug);

    List<LeagueEntity> findByAdmin_IdAdmin(Long idAdmin);
}
package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.LeagueAdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeagueAdminRepository extends JpaRepository<LeagueAdminEntity, Long> {
    Optional<LeagueAdminEntity> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
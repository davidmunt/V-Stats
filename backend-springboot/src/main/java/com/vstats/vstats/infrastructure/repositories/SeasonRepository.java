package com.vstats.vstats.infrastructure.repositories;

import java.util.Optional;

import com.vstats.vstats.domain.entities.SeasonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeasonRepository extends JpaRepository<SeasonEntity, Long> {
    // Optional<SeasonEntity> findBySlug(String slug);
    Optional<SeasonEntity> findByIsActiveTrue();
    Optional<SeasonEntity> findByName(String name);
}

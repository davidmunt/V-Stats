package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.CoachEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<CoachEntity, Long> {
    Optional<CoachEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Optional<CoachEntity> findByEmail(String email);
}
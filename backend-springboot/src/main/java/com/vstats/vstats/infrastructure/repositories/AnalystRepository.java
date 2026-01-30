package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.AnalystEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AnalystRepository extends JpaRepository<AnalystEntity, Long> {
    Optional<AnalystEntity> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
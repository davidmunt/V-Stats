package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<PlayerEntity, Long> {
    Optional<PlayerEntity> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
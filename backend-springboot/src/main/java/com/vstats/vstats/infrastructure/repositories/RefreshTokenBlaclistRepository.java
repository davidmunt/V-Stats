package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.RefreshTokenBlacklistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenBlaclistRepository extends JpaRepository<RefreshTokenBlacklistEntity, Long> {
    boolean existsByToken(String token);
}
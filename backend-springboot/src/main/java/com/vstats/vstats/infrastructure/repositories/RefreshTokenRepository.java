package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.RefreshTokenEntity;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenEntity, Long> {
    List<RefreshTokenEntity> findAllByIdFamily(java.util.UUID idFamily);

    Optional<RefreshTokenEntity> findByHashedToken(String hashedToken);

    List<RefreshTokenEntity> findAllByIdUserAndUserType(Long idUser, String userType);
}
package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.UserEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByEmail(String email);

    boolean existsBySlug(String slug);

    Optional<UserEntity> findByEmail(String email);
}
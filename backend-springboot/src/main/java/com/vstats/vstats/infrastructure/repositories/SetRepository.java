package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.SetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SetRepository extends JpaRepository<SetEntity, Long> {

    Optional<SetEntity> findByMatch_SlugAndSetNumber(String matchSlug, Integer setNumber);
}
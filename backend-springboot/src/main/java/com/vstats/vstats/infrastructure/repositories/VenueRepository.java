package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.VenueEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VenueRepository extends JpaRepository<VenueEntity, Long> {

    Optional<VenueEntity> findBySlug(String slug);

    List<VenueEntity> findAllByIdAdmin(String idAdmin);

    List<VenueEntity> findAllByIsActiveTrue();

    boolean existsBySlug(String slug);
}
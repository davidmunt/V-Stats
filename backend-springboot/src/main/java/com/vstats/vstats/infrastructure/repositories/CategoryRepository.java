package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    Optional<CategoryEntity> findBySlug(String slug);
    List<CategoryEntity> findAllByIdAdmin(String idAdmin);
    boolean existsBySlug(String slug);
}
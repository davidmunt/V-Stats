package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {
    
    // Spring Data JPA crea la query SQL automáticamente al leer el nombre del método:
    // "SELECT * FROM categories WHERE slug = ?"
    Optional<CategoryEntity> findBySlug(String slug);

    // No hace falta poner save(), delete(), findAll()... ¡ya vienen incluidos!
}
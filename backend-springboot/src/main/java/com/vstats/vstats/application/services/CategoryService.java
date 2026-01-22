package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.CategoryEntity;
import java.util.List;
import java.util.Optional;

public interface CategoryService {
    // Definimos qué se puede hacer, pero no cómo
    CategoryEntity createCategory(CategoryEntity category);
    List<CategoryEntity> getAllCategories();
    Optional<CategoryEntity> getCategoryBySlug(String slug);
}
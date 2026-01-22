package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.CategoryEntity;
import com.vstats.vstats.infrastructure.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // ¡Importante! Indica a Spring que esto es un Servicio
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    // Inyección de dependencias por constructor
    // Spring nos da automáticamente una instancia del repositorio aquí
    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryEntity createCategory(CategoryEntity category) {
        // Aquí podrías poner lógica extra antes de guardar.
        // Por ejemplo: si el slug viene vacío, generarlo desde el nombre.
        // De momento, guardamos directo:
        return categoryRepository.save(category);
    }

    @Override
    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Optional<CategoryEntity> getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }
}
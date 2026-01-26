package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.CategoryEntity;
import com.vstats.vstats.infrastructure.repositories.CategoryRepository;
import com.vstats.vstats.presentation.requests.CategoryRequest;
import com.vstats.vstats.presentation.responses.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String slug = generateSlug(request.getName());
        
        CategoryEntity category = CategoryEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .image(request.getImage())
                .idAdmin(request.getIdAdmin())
                .slug(slug)
                .isActive(true)
                .status("active")
                .build();

        return mapToResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getAllCategoriesByAdmin(String idAdmin) {
        return categoryRepository.findAllByIdAdmin(idAdmin).stream()
                .filter(c -> !"deleted".equals(c.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        CategoryEntity category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada: " + slug));
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(String slug, CategoryRequest request) {
        CategoryEntity category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("No existe la categoría: " + slug));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImage(request.getImage());

        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(String slug) {
        CategoryEntity category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("No existe la categoría: " + slug));
        
        category.setIsActive(false);
        category.setStatus("deleted");
        category.setBoxedAt(java.time.LocalDateTime.now());
        categoryRepository.save(category);
    }

    private CategoryResponse mapToResponse(CategoryEntity entity) {
        return CategoryResponse.builder()
                .slug(entity.getSlug())
                .name(entity.getName())
                .description(entity.getDescription())
                .image(entity.getImage())
                .isActive(entity.getIsActive())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private String generateSlug(String input) {
        String nowhitespace = input.replaceAll("\\s", "-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
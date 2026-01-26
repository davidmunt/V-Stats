package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.CategoryEntity;
import com.vstats.vstats.domain.entities.LeagueAdminEntity;
import com.vstats.vstats.infrastructure.repositories.CategoryRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.presentation.requests.category.CreateCategoryRequest;
import com.vstats.vstats.presentation.requests.category.UpdateCategoryRequest;
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
    private final LeagueAdminRepository adminRepository;

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        LeagueAdminEntity admin = adminRepository.findBySlug(request.getSlugAdmin())
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado con el slug: " + request.getSlugAdmin()));

        String slugCategory = generateSlug(request.getName());

        CategoryEntity category = CategoryEntity.builder()
                .idAdmin(admin.getIdAdmin().toString())
                .slug(slugCategory)
                .name(request.getName())
                .description(request.getDescription())
                .image(request.getImage())
                .isActive(true)
                .status("active")
                .build();

        return mapToResponse(categoryRepository.save(category), admin.getSlug());
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .filter(c -> !"deleted".equals(c.getStatus()))
                .map(this::enrichWithAdminSlug)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getCategoriesByAdminSlug(String slugAdmin) {
        LeagueAdminEntity admin = adminRepository.findBySlug(slugAdmin)
                .orElseThrow(() -> new RuntimeException("Admin no encontrado"));

        return categoryRepository.findAllByIdAdmin(admin.getIdAdmin().toString()).stream()
                .filter(c -> !"deleted".equals(c.getStatus()))
                .map(c -> mapToResponse(c, slugAdmin))
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        CategoryEntity category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        return enrichWithAdminSlug(category);
    }

    @Transactional
    public CategoryResponse updateCategory(String slug, UpdateCategoryRequest request) {
        CategoryEntity category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImage(request.getImage());

        if (request.getStatus() != null) {
            category.setStatus(request.getStatus().toLowerCase());
            category.setIsActive("active".equals(category.getStatus()));
        }

        return enrichWithAdminSlug(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(String slug) {
        CategoryEntity category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        category.setIsActive(false);
        category.setStatus("deleted");
        category.setBoxedAt(java.time.LocalDateTime.now());
        categoryRepository.save(category);
    }

    private CategoryResponse enrichWithAdminSlug(CategoryEntity entity) {
        String adminSlug = adminRepository.findById(Long.parseLong(entity.getIdAdmin()))
                .map(LeagueAdminEntity::getSlug)
                .orElse("unknown-admin");
        return mapToResponse(entity, adminSlug);
    }

    private CategoryResponse mapToResponse(CategoryEntity entity, String adminSlug) {
        return CategoryResponse.builder()
                .slug_category(entity.getSlug())
                .slug_admin(adminSlug)
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
        return Pattern.compile("[^\\w-]").matcher(normalized).replaceAll("").toLowerCase(Locale.ENGLISH);
    }
}
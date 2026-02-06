package com.vstats.vstats.application.services;

import com.vstats.vstats.domain.entities.CategoryEntity;
import com.vstats.vstats.domain.entities.LeagueAdminEntity;
import com.vstats.vstats.infrastructure.repositories.CategoryRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.presentation.requests.category.CreateCategoryRequest;
import com.vstats.vstats.presentation.requests.category.UpdateCategoryRequest;
import com.vstats.vstats.presentation.responses.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

        private final CategoryRepository categoryRepository;
        private final LeagueAdminRepository adminRepository;

        @Transactional
        public CategoryResponse createCategory(CreateCategoryRequest request) {
                LeagueAdminEntity admin = adminRepository.findBySlug(request.getSlugAdmin())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Administrador no encontrado con el slug: " + request.getSlugAdmin()));

                if (request.getName() == null || request.getName().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "El nombre de la categoría es obligatorio");
                }

                if (request.getDescription() == null || request.getDescription().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La descripción de la categoría es obligatoria");
                }

                if (request.getImage() == null || request.getImage().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La imagen de la categoría es obligatoria");
                }

                String slugCategory = generateUniqueSlug(request.getName());

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
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Administrador no encontrado con este slug"));

                return categoryRepository.findAllByIdAdmin(admin.getIdAdmin().toString()).stream()
                                .filter(c -> !"deleted".equals(c.getStatus()))
                                .map(c -> mapToResponse(c, slugAdmin))
                                .collect(Collectors.toList());
        }

        public CategoryResponse getCategoryBySlug(String slug) {
                CategoryEntity category = categoryRepository.findBySlug(slug)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Categoria no encontrada con este slug"));

                return enrichWithAdminSlug(category);
        }

        @Transactional
        public CategoryResponse updateCategory(String slug, UpdateCategoryRequest request) {
                CategoryEntity category = categoryRepository.findBySlug(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Categoría no encontrada"));

                if ("deleted".equals(category.getStatus())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "No se puede editar una categoría eliminada");
                }

                if (request.getName() == null || request.getName().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio");
                }

                if (request.getDescription() == null || request.getDescription().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La descripción es obligatoria");
                }

                if (request.getImage() == null || request.getImage().isBlank()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La imagen de la categoría es obligatoria");
                }

                category.setName(request.getName());
                category.setDescription(request.getDescription());
                category.setImage(request.getImage());

                if (request.getStatus() != null && !request.getStatus().isBlank()) {
                        String newStatus = request.getStatus().toLowerCase().trim();
                        if ("deleted".equals(newStatus)) {
                                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                                "Para eliminar usa el método DELETE");
                        }
                        category.setStatus(newStatus);
                        category.setIsActive("active".equals(newStatus));
                }

                return enrichWithAdminSlug(categoryRepository.save(category));
        }

        @Transactional
        public void deleteCategory(String slug) {
                CategoryEntity category = categoryRepository.findBySlug(slug)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND, "Categoría no encontrada"));

                if ("deleted".equals(category.getStatus())) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "La categoría ya ha sido eliminada con anterioridad");
                }

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

        private String generateUniqueSlug(String name) {
                String baseSlug = name.toLowerCase()
                                .trim()
                                .replace(" ", "-")
                                .replaceAll("[^a-z0-9-]", "");

                String finalSlug = baseSlug;
                int count = 1;

                while (categoryRepository.findBySlug(finalSlug).isPresent()) {
                        finalSlug = baseSlug + "-" + count;
                        count++;
                }

                return finalSlug;
        }
}
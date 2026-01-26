package com.vstats.vstats.application.services;
import com.vstats.vstats.domain.entities.CategoryEntity;
import com.vstats.vstats.infrastructure.repositories.CategoryRepository;
import com.vstats.vstats.presentation.requests.CreateCategoryRequest;
import com.vstats.vstats.presentation.responses.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Lógica principal: Recibe Request -> Devuelve Response
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        
        // 1. Convertir Request a Entity (Aquí aplicas reglas de negocio)
        CategoryEntity entityToSave = CategoryEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .image(request.getImage())
                .slug(request.getName().toLowerCase().replace(" ", "-")) // Generamos slug automático
                .adminId(1L) // Simulamos admin por ahora
                .build();
        // 2. Guardar en DB
        CategoryEntity savedEntity = categoryRepository.save(entityToSave);
        // 3. Convertir Entity a Response y devolver
        return mapToResponse(savedEntity);
    }

    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<CategoryEntity> getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    // Método auxiliar privado para reutilizar la conversión a Response
    private CategoryResponse mapToResponse(CategoryEntity entity) {
        return CategoryResponse.builder()
                .slug(entity.getSlug())
                .name(entity.getName())
                .description(entity.getDescription())
                .image(entity.getImage())
                .active(entity.getActive())
                .build();
    }
}
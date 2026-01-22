package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.application.services.CategoryService;
import com.vstats.vstats.domain.entities.CategoryEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indica que esta clase maneja peticiones REST
@RequestMapping("/api/categories") // La URL base será: http://localhost:8080/api/categories
public class CategoryController {

    private final CategoryService categoryService;

    // Inyectamos el servicio en el constructor
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // 1. OBTENER TODAS LAS CATEGORÍAS (GET)
    @GetMapping
    public ResponseEntity<List<CategoryEntity>> getAllCategories() {
        List<CategoryEntity> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories); // Devuelve status 200 OK y la lista
    }

    // 2. OBTENER UNA POR SLUG (GET /{slug})
    @GetMapping("/{slug}")
    public ResponseEntity<CategoryEntity> getCategoryBySlug(@PathVariable String slug) {
        return categoryService.getCategoryBySlug(slug)
                .map(category -> ResponseEntity.ok(category)) // Si existe, devuelve 200 OK
                .orElse(ResponseEntity.notFound().build());   // Si no existe, devuelve 404 Not Found
    }

    // 3. CREAR UNA CATEGORÍA (POST)
    @PostMapping
    public ResponseEntity<CategoryEntity> createCategory(@RequestBody CategoryEntity category) {
        // @RequestBody convierte el JSON que envías en un objeto Java
        CategoryEntity createdCategory = categoryService.createCategory(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory); // Devuelve 201 Created
    }
}
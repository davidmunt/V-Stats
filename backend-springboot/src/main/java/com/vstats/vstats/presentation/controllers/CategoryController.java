package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.application.services.CategoryService;
import com.vstats.vstats.presentation.requests.category.CreateCategoryRequest;
import com.vstats.vstats.presentation.requests.category.UpdateCategoryRequest;
import com.vstats.vstats.presentation.responses.CategoryResponse;
import com.vstats.vstats.security.authorization.CheckSecurity;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Map<String, CategoryResponse>> create(@RequestBody CreateCategoryRequest request) {
        return new ResponseEntity<>(Map.of("category", categoryService.createCategory(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "recent") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(categoryService.getAllCategories(q, status, sort, page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Map<String, CategoryResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(Map.of("category", categoryService.getCategoryBySlug(slug)));
    }

    @GetMapping("/admin/{slugAdmin}")
    public ResponseEntity<Map<String, List<CategoryResponse>>> getByAdmin(@PathVariable String slugAdmin) {
        return ResponseEntity.ok(Map.of("categories", categoryService.getCategoriesByAdminSlug(slugAdmin)));
    }

    @PutMapping("/{slug}")
    @CheckSecurity.Categories.CanManage
    public ResponseEntity<Map<String, CategoryResponse>> update(@PathVariable String slug,
            @RequestBody UpdateCategoryRequest request) {
        return ResponseEntity.ok(Map.of("category", categoryService.updateCategory(slug, request)));
    }

    @DeleteMapping("/{slug}")
    @CheckSecurity.Categories.CanManage
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        categoryService.deleteCategory(slug);
        return ResponseEntity.noContent().build();
    }
}
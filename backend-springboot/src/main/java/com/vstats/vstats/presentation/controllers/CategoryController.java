package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.presentation.requests.CategoryRequest;
import com.vstats.vstats.presentation.responses.CategoryResponse;
import com.vstats.vstats.application.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> create(@RequestBody CategoryRequest request) {
        return new ResponseEntity<>(categoryService.createCategory(request), HttpStatus.CREATED);
    }

    @GetMapping("/admin/{idAdmin}")
    public ResponseEntity<List<CategoryResponse>> getByAdmin(@PathVariable String idAdmin) {
        return ResponseEntity.ok(categoryService.getAllCategoriesByAdmin(idAdmin));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CategoryResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }

    @PutMapping("/{slug}")
    public ResponseEntity<CategoryResponse> update(@PathVariable String slug, @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(slug, request));
    }

    @DeleteMapping("/{slug}")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        categoryService.deleteCategory(slug);
        return ResponseEntity.noContent().build();
    }
}
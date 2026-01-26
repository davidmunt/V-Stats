package com.vstats.vstats.presentation.requests.category;

import lombok.Data;

@Data
public class UpdateCategoryRequest {
private String name;
    private String description;
    private String image;
    private String status;
}
package com.vstats.vstats.presentation.requests;

import lombok.Data;

@Data
public class CreateCategoryRequest {
    private String name;
    private String description;
    private String image;
}
package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {
    private String slug;
    private String name;
    private String description;
    private String image;
    private Boolean active;
}
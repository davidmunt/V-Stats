package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CategoryResponse {
private String slug_category;
    private String slug_admin;
    private String name;
    private String description;
    private String image;
    private Boolean isActive;
    private String status;
    private LocalDateTime createdAt;
}
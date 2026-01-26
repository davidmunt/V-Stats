package com.vstats.vstats.presentation.requests;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private String description;
    private String image;
    private String idAdmin;
}
package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class LeagueResponse {
    private String slug;
    private String name;
    private String country;
    private String season;
    private String image;
    private String categoryName;
    private String status;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
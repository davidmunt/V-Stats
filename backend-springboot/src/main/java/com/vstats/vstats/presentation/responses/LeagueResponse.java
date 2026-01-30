package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class LeagueResponse {
    private String slug_league;
    private String slug_season;
    private String name;
    private String country;
    private String image;
    private String categoryName;
    private String status;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TeamResponse {
    private String slug;
    private String name;
    private String image;
    private String leagueName;
    private String categoryName;
    private String idCoach;
    private String idAnalyst;
    private String status;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
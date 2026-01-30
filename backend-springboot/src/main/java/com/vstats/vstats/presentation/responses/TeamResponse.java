package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class TeamResponse {
    private String slug_league;
    private String slug_team;
    private String slug_season;
    private String slug_coach;
    private String slug_analist;
    private String slug_venue;
    private String name;
    private String image;
    private String status;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
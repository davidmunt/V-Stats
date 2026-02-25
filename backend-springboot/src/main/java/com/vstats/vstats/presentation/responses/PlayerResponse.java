package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class PlayerResponse {
    private String slug_team;
    private String slug_season;
    private String slug_player;
    private String name;
    private String dorsal;
    private String role;
    private String image;
    private String status;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
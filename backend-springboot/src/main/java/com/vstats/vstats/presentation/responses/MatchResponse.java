package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class MatchResponse {
    private String slug_match;
    private String slug_league;
    private String slug_team_local;
    private String slug_team_visitor;
    private String slug_venue;
    private String name;
    private String image;
    private String date;
    private String current_set;
    private String status;
    private String is_active;
    private LocalDateTime createdAt;
}
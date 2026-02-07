package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class LineupResponse {
    private String slug_lineup;
    private String slug_match;
    private String slug_team;
    private List<PlayerPosition> positions;

    @Data
    @Builder
    public static class PlayerPosition {
        private String slug_lineup_position;
        private String slug_player;
        private Integer initial_position;
        private Integer current_position;
        private Boolean is_on_court;
        private String name;
        private Integer dorsal;
        private String role;
        private String image;
    }
}

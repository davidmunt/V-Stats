package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class LineupResponse {
    // Campos para el objeto "lineup" del front
    private String slug; // React pide lineup.slug
    private String slug_lineup;
    private String slug_match;
    private String slug_team;
    private String status;
    private Boolean is_active;
    private String created_at;

    // Esta lista la usaremos para extraerla en el Controller
    private List<PlayerPosition> positions;

    @Data
    @Builder
    public static class PlayerPosition {
        private String slug; // React pide positions[0].slug (alias de slug_lineup_position)
        private String slug_lineup_position;
        private String slug_lineup;
        private String slug_team;
        private String slug_player;
        private String name;
        private String role;
        private String image;
        private Integer dorsal;
        private Boolean is_on_court;
        private Integer initial_position;
        private Integer current_position;
        private String status;
        private Boolean is_active;
    }
}
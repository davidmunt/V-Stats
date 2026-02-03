package com.vstats.vstats.presentation.requests.lineup;

import lombok.Data;
import java.util.List;

@Data
public class UpdateLineupRequest {
    private List<PositionRequest> positions;
    private String status;

    @Data
    public static class PositionRequest {
        private String slug_player;
        private Integer position;
    }
}
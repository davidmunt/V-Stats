package com.vstats.vstats.presentation.requests.lineup;

import lombok.Data;
import java.util.List;

@Data
public class CreateLineupRequest {
    private List<PositionRequest> positions;

    @Data
    public static class PositionRequest {
        private String slug_player; 
        private Integer position; 
    }
}
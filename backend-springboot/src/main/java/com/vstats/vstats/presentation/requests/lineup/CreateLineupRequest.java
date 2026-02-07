package com.vstats.vstats.presentation.requests.lineup;

import lombok.Data;
import java.util.List;

@Data
public class CreateLineupRequest {

    private String slugMatch;
    private String slugTeam;
    private Integer setNumber;

    private List<PlayerPositionRequest> positions;

    @Data
    public static class PlayerPositionRequest {
        private String player_id;
        private Integer position;
    }
}
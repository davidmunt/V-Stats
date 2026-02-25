package com.vstats.vstats.presentation.requests.lineup;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class CreateLineupRequest {

    private String slugMatch; // Este viene de la URL (@PathVariable), no importa el nombre aquí

    @JsonProperty("slug_team") // Obligatorio para que entienda el JSON de React
    private String slugTeam;

    private Integer setNumber;

    private List<PlayerPositionRequest> positions;

    @Data
    public static class PlayerPositionRequest {
        @JsonProperty("slug_player") // React envía slug_player
        private String player_id; // Tu Service usa player_id, así que lo dejamos así

        private Integer position;
    }
}
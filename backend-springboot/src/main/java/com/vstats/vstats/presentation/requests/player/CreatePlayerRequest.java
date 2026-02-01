package com.vstats.vstats.presentation.requests.player;

import lombok.Data;

@Data
public class CreatePlayerRequest {
    private String slugTeam; 
    private String name; 
    private String role;
    private String email; 
    private String avatar;
    private Integer dorsal;
}

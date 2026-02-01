package com.vstats.vstats.presentation.requests.player;

import lombok.Data;

@Data

public class UpdatePlayerRequest {
    private String name; 
    private String role;
    private String email; 
    private String avatar;
    private Integer dorsal;
    private String status;
}
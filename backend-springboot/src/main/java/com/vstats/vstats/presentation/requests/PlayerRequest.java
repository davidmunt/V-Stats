package com.vstats.vstats.presentation.requests;

import lombok.Data;

@Data
public class PlayerRequest {
    private String name;
    private Integer dorsal;
    private String role;
    private String idTeam;
    private String email;
    private String avatar;
}
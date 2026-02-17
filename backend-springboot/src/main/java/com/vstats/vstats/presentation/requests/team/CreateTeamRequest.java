package com.vstats.vstats.presentation.requests.team;

import lombok.Data;

@Data
public class CreateTeamRequest {
    private String slug_league;
    private String slug_venue;
    private String name;
    private String image;
}

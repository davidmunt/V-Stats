package com.vstats.vstats.presentation.requests.team;

import lombok.Data;

@Data
public class CreateTeamRequest {
    private String slugLeague; 
    private String slugVenue;
    private String name; 
    private String image;
}

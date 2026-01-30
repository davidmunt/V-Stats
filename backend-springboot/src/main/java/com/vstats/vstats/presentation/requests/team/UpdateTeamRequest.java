package com.vstats.vstats.presentation.requests.team;

import lombok.Data;

@Data

public class UpdateTeamRequest {
    private String slugCoach;
    private String slugAnalyst;
    private String slugVenue;
    private String name; 
    private String image;
    private String status;
}

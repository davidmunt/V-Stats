package com.vstats.vstats.presentation.requests.team;

import lombok.Data;

@Data

public class UpdateTeamRequest {
    private String slug_coach;
    private String slug_analyst;
    private String slug_venue;
    private String name;
    private String image;
    private String status;
}

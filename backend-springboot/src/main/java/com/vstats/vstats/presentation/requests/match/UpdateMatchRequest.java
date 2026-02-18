package com.vstats.vstats.presentation.requests.match;

import lombok.Data;

@Data

public class UpdateMatchRequest {
    private String name;
    private String slug_team_local;
    private String slug_team_visitor;
    private String image;
    private String date;
    private String status;
}

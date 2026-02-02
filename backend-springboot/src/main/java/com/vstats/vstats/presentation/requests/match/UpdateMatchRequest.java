package com.vstats.vstats.presentation.requests.match;

import lombok.Data;

@Data

public class UpdateMatchRequest {
    private String name; 
    private String slugTeamLocal; 
    private String slugTeamVisitor;
    private String image; 
    private String date;
    private String status;
}

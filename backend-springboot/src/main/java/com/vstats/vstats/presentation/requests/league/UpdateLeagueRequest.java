package com.vstats.vstats.presentation.requests.league;

import lombok.Data;

@Data

public class UpdateLeagueRequest {
    private String slugCategory;
    private String slugSeason;
    private String country;
    private String name; 
    private String season;
    private String image;
    private Integer capacity;
    private String status;
}

package com.vstats.vstats.presentation.requests.league;

import lombok.Data;

@Data
public class CreateLeagueRequest {
    private String slugAdmin; 
    private String slugSeason; 
    private String slugCategory;
    private String name; 
    private String country;
    private String season;
    private String image;
    private Integer capacity;
}

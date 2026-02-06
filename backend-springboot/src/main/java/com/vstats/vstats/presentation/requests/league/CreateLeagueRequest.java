package com.vstats.vstats.presentation.requests.league;

import lombok.Data;

@Data
public class CreateLeagueRequest {
    private String slugAdmin; 
    private String slugCategory;
    private String name; 
    private String country;
    private String image;
}

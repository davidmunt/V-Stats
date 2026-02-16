package com.vstats.vstats.presentation.requests.league;

import lombok.Data;

@Data
public class CreateLeagueRequest {
    private String slug_category;
    private String name;
    private String country;
    private String image;
}

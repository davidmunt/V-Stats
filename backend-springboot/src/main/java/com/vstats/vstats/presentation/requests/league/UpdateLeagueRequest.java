package com.vstats.vstats.presentation.requests.league;

import lombok.Data;

@Data

public class UpdateLeagueRequest {
    private String slug_category;
    private String country;
    private String name;
    private String image;
    private String status;
}

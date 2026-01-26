package com.vstats.vstats.presentation.requests;

import lombok.Data;

@Data
public class CreateLeagueRequest {
    private String name;
    private String country;
    private String season;
    private String image;
    private String idAdmin;
    private Long idCategory; 
}
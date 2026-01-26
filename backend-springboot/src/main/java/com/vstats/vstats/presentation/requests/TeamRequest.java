package com.vstats.vstats.presentation.requests;

import lombok.Data;

@Data
public class TeamRequest {
    private String name;
    private String image;
    private String idCoach;
    private String idAnalyst;
    private Long idLeague;
    private Long idCategory;
}
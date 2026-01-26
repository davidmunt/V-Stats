package com.vstats.vstats.presentation.requests;

import lombok.Data;

@Data
public class VenueRequest {
    private String name;
    private String address;
    private String city;
    private Integer capacity;
    private Boolean indoor;
    private String idAdmin; 
}
package com.vstats.vstats.presentation.requests.venue;

import lombok.Data;

@Data
public class UpdateVenueRequest {
    private String name;
    private String address;
    private String city;
    private Integer capacity;
    private Boolean indoor;
    private String status; 
}
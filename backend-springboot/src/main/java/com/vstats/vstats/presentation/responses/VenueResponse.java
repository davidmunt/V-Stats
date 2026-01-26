package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class VenueResponse {
    private String slug_venue;
    private String slug_admin;
    private String name;
    private String address;
    private String city;
    private Integer capacity;
    private Boolean indoor;
    private Boolean isActive;
    private String status;
    private LocalDateTime createdAt;
}
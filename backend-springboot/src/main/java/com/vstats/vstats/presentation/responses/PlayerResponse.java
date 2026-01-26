package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PlayerResponse {
    private String slug;
    private String name;
    private Integer dorsal;
    private String role;
    private String idTeam;
    private String email;
    private String avatar;
    private String status;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
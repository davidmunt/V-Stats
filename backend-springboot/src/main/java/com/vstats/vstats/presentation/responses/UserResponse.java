package com.vstats.vstats.presentation.responses;

import lombok.Builder;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class UserResponse {
    private String slug_team;
    private String slug_user;
    private String name;
    private String email;
    private String user_type;
    private String avatar;
    private String token;
}
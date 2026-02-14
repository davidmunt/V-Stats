package com.vstats.vstats.presentation.requests.auth;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String email;
    private String avatar;
    private String password;
}
package com.vstats.vstats.presentation.requests.auth;

import lombok.Data;

@Data
public class LoginUserRequest {
    private String email;
    private String password;
}
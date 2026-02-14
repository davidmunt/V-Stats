package com.vstats.vstats.presentation.requests.auth;

import lombok.Data;

@Data
public class RegisterUserRequest {
    private String user_type;
    private String name;
    private String email;
    private String password;
}
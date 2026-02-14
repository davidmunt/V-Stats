package com.vstats.vstats.security;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vstats.vstats.presentation.requests.auth.LoginUserRequest;
import com.vstats.vstats.presentation.requests.auth.RegisterUserRequest;
import com.vstats.vstats.presentation.responses.UserResponse;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterUserRequest register) {
        return ResponseEntity.ok(authService.register(register));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> authenticate(@Valid @RequestBody LoginUserRequest authenticate) {
        return ResponseEntity.ok(authService.authenticate(authenticate));
    }
}
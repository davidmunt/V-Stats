package com.vstats.vstats.security;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vstats.vstats.presentation.requests.auth.LoginUserRequest;
import com.vstats.vstats.presentation.requests.auth.RegisterUserRequest;
import com.vstats.vstats.presentation.responses.UserResponse;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterUserRequest register,
            @RequestHeader(value = "User-Agent", defaultValue = "unknown") String userAgent,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.register(register, userAgent, response));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @Valid @RequestBody LoginUserRequest authenticate,
            @RequestHeader(value = "User-Agent", defaultValue = "unknown") String userAgent,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.login(authenticate, userAgent, response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        return ResponseEntity.ok(authService.refresh(request, response));
    }
}
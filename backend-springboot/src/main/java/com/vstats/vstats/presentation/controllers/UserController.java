package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.application.services.UserService;
import com.vstats.vstats.presentation.requests.auth.*;
import com.vstats.vstats.presentation.responses.UserResponse;
import com.vstats.vstats.security.authorization.CheckSecurity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @CheckSecurity.Protected.CanManage
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping
    @CheckSecurity.Protected.CanManage
    public ResponseEntity<UserResponse> update(@RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(request));
    }
}
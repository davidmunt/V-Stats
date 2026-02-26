package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.application.services.UserService;
import com.vstats.vstats.presentation.requests.auth.*;
import com.vstats.vstats.presentation.responses.UserResponse;
import com.vstats.vstats.presentation.responses.AnalystResponse;
import com.vstats.vstats.presentation.responses.CoachResponse;
import com.vstats.vstats.security.authorization.CheckSecurity;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

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

    // @GetMapping("/free/coaches")
    // @CheckSecurity.Protected.CanManage
    // public ResponseEntity<Map<String, List<CoachResponse>>> getFreeCoaches() {
    // return ResponseEntity.ok(Map.of("coaches", userService.getFreeCoaches()));
    // }

    // @GetMapping("/free/analysts")
    // @CheckSecurity.Protected.CanManage
    // public ResponseEntity<Map<String, List<AnalystResponse>>> getFreeAnalysts() {
    // return ResponseEntity.ok(Map.of("analysts", userService.getFreeAnalysts()));
    // }

    // @GetMapping("/assigned/coaches")
    // @CheckSecurity.Protected.CanManage
    // public ResponseEntity<Map<String, List<CoachResponse>>> getAssignedCoaches()
    // {
    // return ResponseEntity.ok(Map.of("coaches",
    // userService.getAssignedCoaches()));
    // }

    // @GetMapping("/assigned/analysts")
    // @CheckSecurity.Protected.CanManage
    // public ResponseEntity<Map<String, List<AnalystResponse>>>
    // getAssignedAnalysts() {
    // return ResponseEntity.ok(Map.of("analysts",
    // userService.getAssignedAnalysts()));
    // }
}
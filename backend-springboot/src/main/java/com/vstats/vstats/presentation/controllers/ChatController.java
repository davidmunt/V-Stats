package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.application.services.ChatService;
import com.vstats.vstats.presentation.requests.chat.ChatRequest;
import com.vstats.vstats.presentation.responses.ChatResponse;
import com.vstats.vstats.security.authorization.CheckSecurity;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    @PreAuthorize("hasRole('coach')")
    public ResponseEntity<Map<String, ChatResponse>> create(@RequestBody ChatRequest request) {
        return new ResponseEntity<>(Map.of("chat", chatService.createChat(request)), HttpStatus.CREATED);
    }
}
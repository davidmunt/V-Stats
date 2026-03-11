package com.vstats.vstats.presentation.controllers;

import com.vstats.vstats.application.services.PaymentService;
import com.vstats.vstats.presentation.requests.payment.CreatePaymentRequest;
import com.vstats.vstats.presentation.responses.PaymentIntentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    @PreAuthorize("hasRole('COACH')") // Solo los coaches pueden comprar el VIP
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(@RequestBody CreatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.createPaymentIntent(request));
    }
}
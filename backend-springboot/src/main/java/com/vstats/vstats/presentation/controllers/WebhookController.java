package com.vstats.vstats.presentation.controllers;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.vstats.vstats.application.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class WebhookController {

    private final PaymentService paymentService;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            // 1. Validar que la petición viene de Stripe y no ha sido alterada
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);

            // 2. Pasamos el evento al servicio para procesar la lógica de negocio
            paymentService.processWebhookEvent(event);

            return ResponseEntity.ok("Webhook procesado");
        } catch (SignatureVerificationException e) {
            // Si la firma es falsa, devolvemos 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Firma inválida");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno");
        }
    }
}

package com.vstats.vstats.application.services;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.vstats.vstats.domain.entities.CoachEntity;
import com.vstats.vstats.domain.entities.PaymentEntity;
import com.vstats.vstats.infrastructure.repositories.CoachRepository;
import com.vstats.vstats.presentation.requests.payment.CreatePaymentRequest;
import com.vstats.vstats.presentation.responses.PaymentIntentResponse;
import com.vstats.vstats.security.AuthUtils;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.stripe.model.Event;
import com.vstats.vstats.infrastructure.repositories.PaymentRepository;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final AuthUtils authUtils;
    private final CoachRepository coachRepository;
    private final PaymentRepository paymentRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentIntentResponse createPaymentIntent(CreatePaymentRequest request) {
        Long currentUserId = authUtils.getCurrentUserId();
        String userRole = authUtils.getCurrentUserRole();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(1000L) // Precio fijo del VIP (ej: 10€)
                .setCurrency("eur")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                // CLAVE: Metadatos para el Webhook posterior
                .putMetadata("userId", String.valueOf(currentUserId))
                .putMetadata("userType", userRole)
                .build();

        try {
            PaymentIntent intent = PaymentIntent.create(params);

            return PaymentIntentResponse.builder()
                    .clientSecret(intent.getClientSecret())
                    .paymentIntentId(intent.getId())
                    .amount(intent.getAmount())
                    .currency(intent.getCurrency())
                    .build();
        } catch (StripeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al contactar con Stripe");
        }
    }

    @Transactional
    public void processWebhookEvent(Event event) {
        // Solo nos interesa cuando el pago ha sido un éxito
        if ("payment_intent.succeeded".equals(event.getType())) {

            // 1. Convertir el objeto del evento a un PaymentIntent de Stripe
            PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElseThrow(() -> new RuntimeException("No se pudo leer el objeto de Stripe"));

            // 2. Recuperar los metadatos que enviamos al crear el Intent
            String userIdStr = intent.getMetadata().get("userId");
            String userType = intent.getMetadata().get("userType");
            Long userId = Long.parseLong(userIdStr);

            // 3. Lógica de negocio: Activar VIP si es un Coach
            if ("coach".equalsIgnoreCase(userType)) {
                CoachEntity coach = coachRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("Coach no encontrado"));

                coach.setIsVip(true); // <--- ACTIVAMOS EL VIP
                coachRepository.save(coach);
            }

            // 4. Registrar el pago en nuestra tabla de auditoría (PaymentEntity)
            PaymentEntity payment = PaymentEntity.builder()
                    .slug("pay-" + intent.getId())
                    .idUser(userIdStr)
                    .userType(userType)
                    .amount(BigDecimal.valueOf(intent.getAmount()).divide(BigDecimal.valueOf(100))) // Céntimos a Euros
                    .currency(intent.getCurrency())
                    .paymentMethod(intent.getPaymentMethod())
                    .idStripePayment(intent.getId())
                    .status("completed")
                    .isActive(true)
                    .build();

            paymentRepository.save(payment);
        }
    }
}

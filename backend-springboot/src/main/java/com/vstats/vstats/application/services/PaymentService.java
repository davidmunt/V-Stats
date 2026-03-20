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
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
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
                .setAmount(1000L)
                .setCurrency("eur")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
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
        System.out.println("--- [WEBHOOK RECEPCIÓN] Tipo: " + event.getType() + " ---");

        if (!"payment_intent.succeeded".equals(event.getType())) {
            System.out.println("[INFO] Evento ignorado (no es 'succeeded')");
            return;
        }

        try {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
            PaymentIntent intent = null;

            if (dataObjectDeserializer.getObject().isPresent()) {
                intent = (PaymentIntent) dataObjectDeserializer.getObject().get();
            } else {
                intent = (PaymentIntent) event.getData().getObject();
            }

            if (intent == null) {
                throw new RuntimeException("Error crítico: El objeto PaymentIntent es nulo tras la deserialización");
            }

            if (paymentRepository.existsByIdStripePayment(intent.getId())) {
                return;
            }

            Map<String, String> metadata = intent.getMetadata();

            String userIdStr = metadata.get("userId");
            String userType = metadata.get("userType");

            if (userIdStr == null || userType == null) {
                throw new RuntimeException("Metadatos userId o userType ausentes");
            }

            Long userId = Long.parseLong(userIdStr);

            if ("coach".equalsIgnoreCase(userType)) {
                CoachEntity coach = coachRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("Coach no encontrado con ID: " + userId));

                coach.setIsVip(true);
                coachRepository.save(coach);
            }

            PaymentEntity payment = PaymentEntity.builder()
                    .slug("pay-" + intent.getId() + "-" + System.currentTimeMillis())
                    .idUser(userIdStr)
                    .userType(userType)
                    .amount(BigDecimal.valueOf(intent.getAmount()).divide(BigDecimal.valueOf(100), 2,
                            java.math.RoundingMode.HALF_UP))
                    .currency(intent.getCurrency().toUpperCase())
                    .paymentMethod(intent.getPaymentMethod() != null ? intent.getPaymentMethod() : "STRIPE_CARD")
                    .idStripePayment(intent.getId())
                    .status("completed")
                    .isActive(true)
                    .build();

            paymentRepository.save(payment);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}

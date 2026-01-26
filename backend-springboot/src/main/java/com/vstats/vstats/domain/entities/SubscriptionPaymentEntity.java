package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "subscription_payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SubscriptionPaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_payment")
    private Long idPayment;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "id_user", nullable = false)
    private String idUser;

    private BigDecimal amount;

    private String currency;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "id_stripe_payment")
    private String idStripePayment;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Builder.Default
    private String status = "completed";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "boxed_at")
    private LocalDateTime boxedAt;
}
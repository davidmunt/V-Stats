package com.vstats.vstats.presentation.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentIntentResponse {
    private String clientSecret;
    private String paymentIntentId;
    private Long amount;
    private String currency;
}
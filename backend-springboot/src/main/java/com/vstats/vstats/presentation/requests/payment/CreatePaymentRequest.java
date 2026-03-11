package com.vstats.vstats.presentation.requests.payment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreatePaymentRequest {
    @NotBlank
    private String priceId;
}
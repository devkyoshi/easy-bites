package com.ds.orderservice.dto;

import com.ds.orderservice.dao.PaymentStatus;
import lombok.Data;

@Data
public class UpdatePaymentStatusRequest {
    private PaymentStatus paymentStatus;
}
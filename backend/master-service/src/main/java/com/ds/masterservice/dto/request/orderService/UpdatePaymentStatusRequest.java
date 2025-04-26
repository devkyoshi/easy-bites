package com.ds.masterservice.dto.request.orderService;

import com.ds.masterservice.dao.orderService.PaymentStatus;
import lombok.Data;

@Data
public class UpdatePaymentStatusRequest {
    private PaymentStatus paymentStatus;
}
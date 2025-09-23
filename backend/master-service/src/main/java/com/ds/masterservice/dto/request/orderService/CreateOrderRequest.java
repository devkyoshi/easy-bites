package com.ds.masterservice.dto.request.orderService;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CreateOrderRequest {
    @NotNull(message = "Cart ID is required")
    private Long cartId;
    
    @NotBlank(message = "Delivery address is required")
    @Size(min = 10, max = 255, message = "Delivery address must be between 10 and 255 characters")
    private String deliveryAddress;
}
package com.ds.masterservice.dto.request.orderService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class UpdateCartRequest {
    @NotEmpty(message = "Items list cannot be empty")
    @Valid
    private List<CartItemRequest> items;
}

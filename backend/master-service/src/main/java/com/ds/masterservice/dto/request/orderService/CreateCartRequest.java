package com.ds.masterservice.dto.request.orderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;


@Data
public class CreateCartRequest {
    @NotNull(message = "User ID cannot be null")
    private Long userId;
//    private Long restaurantId;
//    private String restaurantName;
    @Valid
    private List<CartItemRequest> items;
}


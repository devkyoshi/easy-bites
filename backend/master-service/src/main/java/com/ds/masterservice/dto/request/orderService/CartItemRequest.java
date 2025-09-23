package com.ds.masterservice.dto.request.orderService;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class CartItemRequest {
    @NotNull(message = "Item ID cannot be null")
    private Long itemId;
    
    @NotBlank(message = "Item name cannot be blank")
    private String itemName;
    
    private String itemImage;
    
    @NotNull(message = "Restaurant ID cannot be null")
    private Long restaurantId;
    
    @NotBlank(message = "Restaurant name cannot be blank")
    private String restaurantName;
    
    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    @NotNull(message = "Unit price cannot be null")
    @Positive(message = "Unit price must be positive")
    private Double unitPrice;
}

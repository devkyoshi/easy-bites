package com.ds.orderservice.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class RemoveCartItemRequest {
    private Long itemId;

    // Getters and Setters
}

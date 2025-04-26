package com.ds.masterservice.dto.request.orderService;

import lombok.Data;

@Data

public class UpdateCartItemRequest {
    private Long itemId;
    private int quantity;

}

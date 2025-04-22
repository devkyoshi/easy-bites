// RemoveOrDecrementItemRequest.java
package com.ds.orderservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data

public class RemoveOrDecrementItemRequest {
    @NotNull
    private Long itemId;
}

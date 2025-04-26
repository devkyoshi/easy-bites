// RemoveOrDecrementItemRequest.java
package com.ds.masterservice.dto.request.orderService;

import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

@Data

public class RemoveOrDecrementItemRequest {
    @NotNull
    private Long itemId;
}

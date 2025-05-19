package com.ds.masterservice.dto.response.restaurant;

import com.ds.masterservice.dao.orderService.Order;
import com.ds.masterservice.dto.response.OrderItemResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderReqResponse {
    private Long orderId;
    private List<OrderItemResponse> orderItems;
    private String orderStatus;
    private String paymentStatus;
    private String orderDate;
    private String deliveryAddress;
    private Double totalAmount;
    private String customerName;
    private String customerPhone;



/*    public OrderReqResponse(Order order, String customerName, String customerPhone) {
        this.orderId = order.getId();
        this.orderItems = order.getItems().stream()
                .map(item -> new OrderItemResponse(item.getItemId(), item.getQuantity(), item.getUnitPrice(), item.getTotalPrice()))
                .toList();
        this.orderStatus = order.getStatus().name();
        this.paymentStatus = order.getPaymentStatus().name();
        this.orderDate = order.getCreatedAt().toString();
        this.deliveryAddress = order.getDeliveryAddress();
        this.totalAmount = order.getTotalAmount();
        this.customerName = customerName;
        this.customerPhone = customerPhone;
    }*/
}

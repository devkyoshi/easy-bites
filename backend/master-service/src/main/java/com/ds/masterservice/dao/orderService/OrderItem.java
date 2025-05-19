package com.ds.masterservice.dao.orderService;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_order_item")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    private Long itemId;
    private String itemName;
    private String itemImage;
    private Long restaurantId;
    private String restaurantName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
}
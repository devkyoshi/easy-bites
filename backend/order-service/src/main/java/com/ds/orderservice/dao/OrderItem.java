package com.ds.orderservice.dao;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "t_order_item")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long itemId;
    private String itemName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
}
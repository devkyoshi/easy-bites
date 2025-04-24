package com.ds.orderservice.dao;

public enum OrderStatus {
    PENDING,
    RESTAURANT_ACCEPTED,
    DRIVER_ASSIGNED,
    DELIVERED,
    CANCELLED,
    DELIVERY_FAILED
}
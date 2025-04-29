package com.ds.commons.enums;

import lombok.Getter;

@Getter
public enum UserType {
    CUSTOMER("CUSTOMER"),
    RESTAURANT_MANAGER("RESTAURANT_MANAGER"),
    DELIVERY_PERSON("DELIVERY_PERSON"),
    SYSTEM_ADMIN("SYSTEM_ADMIN");

    private final String role;

    UserType(String role) {
        this.role = role;
    }
}

package com.ds.commons.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ExceptionCode {
    SOMETHING_WENT_WRONG("SOMETHING_WENT_WRONG"),
    USER_NOT_FOUND("USER_NOT_FOUND"),
    USER_ALREADY_EXISTS("USER_ALREADY_EXISTS"),
    USER_NOT_AUTHORIZED("USER_NOT_AUTHORIZED"),
    USER_NOT_AUTHENTICATED("USER_NOT_AUTHENTICATED"),
    USER_NOT_VALID("USER_NOT_VALID"),
    INVALID_DATE_FORMAT("INVALID_DATE_FORMAT"),
    ROLE_NOT_FOUND("ROLE_NOT_FOUND"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS"),
    INVALID_BUDGET("INVALID_BUDGET"),
    INVALID_USER_TYPE("INVALID_USER_TYPE"),
    REGISTRATION_FAILED("REGISTRATION_FAILED"),
    LOGIN_FAILED("LOGIN_FAILED"),
    WEAK_PASSWORD("WEAK_PASSWORD"),

    RESTAURANT_MANAGER_NOT_FOUND("RESTAURANT_MANAGER_NOT_FOUND"),
    FOOD_ITEM_NOT_FOUND("FOOD_ITEM_NOT_FOUND"),
    MENU_CATEGORY_NOT_FOUND("MENU_CATEGORY_NOT_FOUND"),
    MENU_CATEGORY_ALREADY_EXISTS("MENU_CATEGORY_ALREADY_EXISTS_FOR_RESTAURANT"),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR"),
    FOOD_ITEM_ALREADY_EXISTS("FOOD_ITEM_ALREADY_EXISTS"),
    RESTAURANT_NOT_FOUND("RESTAURANT_NOT_FOUND"),
    RESTAURANT_ALREADY_EXISTS("RESTAURANT_ALREADY_EXISTS"),
    MISSING_REQUIRED_FIELDS("MISSING_REQUIRED_FIELDS"),
    INVALID_VEHICLE_TYPE("INVALID_VEHICLE_TYPE"),
    LICENSE_ALREADY_EXISTS("LICENSE_ALREADY_EXISTS"),
    VEHICLE_NUMBER_ALREADY_EXISTS("VEHICLE_NUMBER_ALREADY_EXISTS"),
    DRIVER_NOT_FOUND("Driver not found"),
    ORDER_NOT_FOUND("Invalid order. Not available"),
    DRIVER_NOT_AVAILABLE("Complete the current order first"),
    DRIVER_ACCEPTED_ORDER("Order is already in progress."),
    CUSTOMER_NOT_FOUND("Customer not found"),
    DELIVERY_NOT_FOUND("Delivery not found"),
    NO_DELIVERY_HISTORY("No completed delivery found"),
    NO_ACTIVE_HISTORY("No active delivery found"),
    EMAIL_UNAVAILABLE("Email feature is currently unavailable."),
    GEOCODING_UNAVAILABLE("Geocoding is currently unavailable"),
    EMAIL_SEND_FAILURE("Failed to send email"),
    DELIVERY_NOT_COMPLETED("Delivery is not completed yet."),
    INVALID_RATING("Invalid rating"),
    NO_DRIVER_STATS("There is no driver stats."),
    NO_DRIVER_RATING("There is no driver rating"),
    NO_DELIVERY_FOUND("There are no deliveries found"),
    INVALID_REQUEST_TYPE("Sending invalid request type. Please check your role"),
    EMAIL_ALREADY_EXISTS("The email address already exists"),
    ACCESS_DENIED("You do not have permission to access this resource."),
    //orderService
    CART_NOT_FOUND("CART_NOT_FOUND"),
    ITEM_NOT_FOUND_IN_CART("ITEM_NOT_FOUND_IN_CART"),
    CANNOT_MODIFY_NON_ACTIVE_CART("CANNOT_MODIFY_NON_ACTIVE_CART"),
    CANNOT_CHECKOUT_NON_ACTIVE_CART("CANNOT_CHECKOUT_NON_ACTIVE_CART"),
    CANNOT_CREATE_ORDER_FROM_CART("CANNOT_CREATE_ORDER_FROM_CART"),
    CANNOT_CANCEL_NON_PENDING_ORDER("CANNOT_CANCEL_NON_PENDING_ORDER"),
    INVALID_ORDER_STATUS("INVALID_ORDER_STATUS"),
    ORDER_ITEM_NOT_FOUND("No item found"),
    NO_AVAILABLE_DRIVERS("No drivers are currently available."),
    NO_COORDINATES_FOUND("No coordinates found for the address"),
    SOCKET_ERROR("Encountered an socket issue"),
    ACCOUNT_LOCKED("Account is temporarily locked due to too many failed login attempts. Please try again later."),;

    private final String exceptionCode;
}

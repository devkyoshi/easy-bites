package com.ds.authservice.controllers;

import com.ds.authservice.dto.request.UpdateRegisterCustomerRequest;
import com.ds.authservice.dto.request.UpdateRegisterDeliveryPersonnelRequest;
import com.ds.authservice.dto.request.UpdateRegisterRestaurantManagerRequest;
import com.ds.authservice.dto.response.CustomerUserResponse;
import com.ds.authservice.dto.response.DeliveryPersonResponse;
import com.ds.authservice.dto.response.RestaurantManagerResponse;

import com.ds.authservice.services.UserService;
import com.ds.authservice.utils.ApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    public final UserService userService;

    @PutMapping("/update/customer/{userId}")
    public ResponseEntity<ApiResponse<CustomerUserResponse>> updateCustomer(@RequestBody UpdateRegisterCustomerRequest request, @PathVariable Long userId) {
        log.info("Attempting to update customer with ID: {}", userId);
        return ResponseEntity.ok(userService.updateCustomer(request, userId));
    }

    @PutMapping("/update/restaurant-manager/{userId}")
    public ResponseEntity<ApiResponse<RestaurantManagerResponse>> updateRestaurantManager(@RequestBody UpdateRegisterRestaurantManagerRequest request, @PathVariable Long userId) {
        log.info("Attempting to update restaurant manager with ID: {}", userId);
        return ResponseEntity.ok(userService.updateRestaurantManager(request, userId));
    }

    @PutMapping("/update/delivery-personnel/{userId}")
    public ResponseEntity<ApiResponse<DeliveryPersonResponse>> updateDeliveryPersonnel(@RequestBody UpdateRegisterDeliveryPersonnelRequest request, @PathVariable Long userId) {
        log.info("Attempting to update delivery personnel with ID: {}", userId);
        return ResponseEntity.ok(userService.updateDeliveryPersonnel(request, userId));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<?>> getUserProfile() {
        log.info("Attempting to get user profile");
        return ResponseEntity.ok(userService.getUserProfile());
    }

    @DeleteMapping("/remove")
    public ResponseEntity<ApiResponse<?>> removeAccount() {
        log.info("Attempting to remove account");
        return ResponseEntity.ok(userService.removeAccount());
    }

    @DeleteMapping("/remove/{userId}")
    public ResponseEntity<ApiResponse<?>> removeUser(@PathVariable Long userId) {
        log.info("Attempting to remove user");
        return ResponseEntity.ok(userService.removeUserById(userId));
    }

}

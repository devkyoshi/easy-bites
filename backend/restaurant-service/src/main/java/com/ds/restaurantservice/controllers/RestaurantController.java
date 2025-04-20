package com.ds.restaurantservice.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/restaurant")
public class RestaurantController {

    @GetMapping("/health")
    public String health() {
        return "Restaurant Service is up and running!";
    }
}

package com.ds.orderservice.controller;

import com.ds.commons.template.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/order")
public class orderController {
    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.successResponse("Auth Service is up and running!");
    }

}

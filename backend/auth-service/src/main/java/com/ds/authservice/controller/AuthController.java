package com.ds.authservice.controller;

import com.ds.authservice.service.JwtService;
import com.ds.commons.dto.request.LoginRequest;
import com.ds.commons.dto.request.RegisterUserRequest;
import com.ds.commons.dto.response.LoginResponse;
import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.exception.CustomException;

import com.ds.commons.template.ApiResponse;

import com.ds.masterservice.MasterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final MasterService masterService;
    private final JwtService jwtService;


    @Autowired
    public AuthController(MasterService masterService, JwtService jwtService) {
        this.masterService = masterService;
        this.jwtService = jwtService;
    }

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.successResponse("Auth Service is up and running!");
    }

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@RequestBody RegisterUserRequest registerRequest) throws CustomException {

        log.info("Attempting to register user with username: {}", registerRequest.getUsername());
        return masterService.getUserService().registerUser(registerRequest);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest authRequest) throws CustomException {

        log.info("Attempting to login user with username: {}", authRequest.getUsername());
        ApiResponse<LoginResponse> response = masterService.getUserService().loginUser(authRequest);

        if(response.isSuccess()) {
            String token = jwtService.generateToken(response.getResult());
            response.getResult().setAccessToken(token);

            log.info("User {} logged in successfully.", authRequest.getUsername());
        }

        return response;
    }


/*    @PostMapping("/update-customer")
    public ApiResponse<RegisterResponse> updateCustomer(@RequestBody CustomerUserRequest registerRequest) throws CustomException {
        log.info("Attempting to update user with username: {}", registerRequest.getUsername());
        return masterService.getUserService().updateCustomer(registerRequest);
    }*/
}

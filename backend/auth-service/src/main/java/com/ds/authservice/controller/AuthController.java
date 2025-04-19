package com.ds.authservice.controller;

import com.ds.authservice.dto.*;
import com.ds.authservice.service.JwtService;
import com.ds.commons.dto.request.RegisterUserRequest;
import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.MasterService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final MasterService masterService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(MasterService masterService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.masterService = masterService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.successResponse("Auth Service is up and running!");
    }

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@RequestBody RegisterUserRequest registerRequest) throws CustomException {
        return masterService.getUserService().registerUser(registerRequest);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        if (authentication.isAuthenticated()) {

            String token = jwtService.generateToken(authRequest.getUsername());
            LoginResponse response = new LoginResponse( token);
            return ApiResponse.successResponse(response);
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }
}

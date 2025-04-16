package com.ds.authservice.controller;

import com.ds.authservice.dto.*;
import com.ds.authservice.service.JwtService;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(UserService userService, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.successResponse("Auth Service is up and running!");
    }

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@RequestBody RegisterUserRequest registerRequest) {

        ApiResponse<UserResponseDTO> registeredUser = userService.registerUser(registerRequest);
        return null;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        if (authentication.isAuthenticated()) {
            return ApiResponse.successResponse(new LoginResponse(jwtService.generateToken(authRequest.getUsername())));
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }
}

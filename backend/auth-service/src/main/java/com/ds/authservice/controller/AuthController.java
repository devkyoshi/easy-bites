package com.ds.authservice.controller;

import com.ds.authservice.service.FirebaseAuthService;
import com.ds.authservice.service.JwtService;
import com.ds.commons.dto.request.FirebaseLoginRequest;
import com.ds.commons.dto.request.LoginRequest;
import com.ds.commons.dto.request.RegisterUserRequest;
import com.ds.commons.dto.response.LoginResponse;
import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.enums.UserType;
import com.ds.commons.exception.CustomException;

import com.ds.commons.template.ApiResponse;

import com.ds.masterservice.MasterService;
import com.ds.masterservice.dto.request.deliveryService.DriverRegistrationRequest;
import com.ds.masterservice.dto.request.user.RestaurantManagerRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuthException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final MasterService masterService;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;
    private final FirebaseAuthService firebaseAuthService;


    @Autowired
    public AuthController(MasterService masterService, JwtService jwtService, 
                         ObjectMapper objectMapper, FirebaseAuthService firebaseAuthService) {
        this.masterService = masterService;
        this.jwtService = jwtService;
        this.objectMapper = objectMapper;
        this.firebaseAuthService = firebaseAuthService;
    }

    @GetMapping("/health")
    public ApiResponse<String> health() {
        return ApiResponse.successResponse("Auth Service is up and running!");
    }

    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@RequestBody Map<String, Object> requestMap) throws CustomException {
        RegisterUserRequest request = objectMapper.convertValue(requestMap, RegisterUserRequest.class);
        log.info("Attempting to register user: {}", request.getUsername());
        return masterService.getUserService().registerUser(request);
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

    //Restaurant User Registration
    @PostMapping("/register-restaurant-manager")
    public ApiResponse<RegisterResponse> registerRestaurant(@RequestBody RestaurantManagerRequestDTO registerRequest) throws CustomException {
        log.info("Attempting to register restaurant user with username: {}", registerRequest.getUsername());
        return masterService.registerRestaurantManager(registerRequest);
    }


    //Driver User Registration
    @PostMapping("/register-driver")
    public ApiResponse<RegisterResponse> registerDriver(@RequestBody DriverRegistrationRequest registerRequest) throws CustomException {
        log.info("Attempting to register driver user with username: {}", registerRequest.getUsername());
        return masterService.registerDriver(registerRequest);
    }

    // Firebase OAuth Login
    @PostMapping("/firebase-login")
    public ApiResponse<LoginResponse> firebaseLogin(@RequestBody FirebaseLoginRequest request) {
        try {
            log.info("Processing Firebase login request");
            
            if (request.getIdToken() == null || request.getIdToken().isEmpty()) {
                log.error("Firebase ID token is missing or empty");
                return ApiResponse.errorResponse("Firebase ID token is required", HttpStatus.BAD_REQUEST);
            }
            
            // Verify Firebase token and get/create user
            LoginResponse response = firebaseAuthService.verifyFirebaseTokenAndGetUser(request.getIdToken());
            
            log.info("Firebase login successful for user: {}", response.getUsername());
            return ApiResponse.successResponse(response);
            
        } catch (FirebaseAuthException e) {
            log.error("Firebase authentication failed: {}", e.getMessage(), e);
            return ApiResponse.errorResponse("Firebase authentication failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (IllegalStateException e) {
            log.error("Firebase initialization error: {}", e.getMessage(), e);
            return ApiResponse.errorResponse("Firebase initialization error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Error processing Firebase login: {}", e.getMessage(), e);
            return ApiResponse.errorResponse("Error processing Firebase login: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


/*    @PostMapping("/update-customer")
    public ApiResponse<RegisterResponse> updateCustomer(@RequestBody CustomerUserRequest registerRequest) throws CustomException {
        log.info("Attempting to update user with username: {}", registerRequest.getUsername());
        return masterService.getUserService().updateCustomer(registerRequest);
    }*/
}

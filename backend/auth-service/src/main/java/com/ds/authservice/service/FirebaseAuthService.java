package com.ds.authservice.service;

import com.ds.commons.dto.response.LoginResponse;
import com.ds.commons.enums.UserType;
import com.ds.masterservice.MasterService;
import com.ds.masterservice.dao.authService.Customer;
import com.ds.masterservice.dao.authService.Role;
import com.ds.masterservice.dao.authService.User;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FirebaseAuthService {

    private final JwtService jwtService;
    private final MasterService masterService;

    @Autowired
    public FirebaseAuthService(JwtService jwtService, MasterService masterService) {
        this.jwtService = jwtService;
        this.masterService = masterService;
    }

    /**
     * Verify Firebase ID token and create or retrieve the user
     * @param idToken Firebase ID token from the client
     * @return Login response with user details and JWT token
     */
    public LoginResponse verifyFirebaseTokenAndGetUser(String idToken) throws FirebaseAuthException {
        try {
            log.info("Attempting to verify Firebase ID token");
            
            // Check if Firebase is initialized
            if (FirebaseAuth.getInstance() == null) {
                log.error("Firebase Authentication instance is null");
                throw new IllegalStateException("Firebase Authentication is not initialized");
            }
            
            // Verify the Firebase ID token
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            
            if (decodedToken == null) {
                log.error("Failed to decode Firebase token");
                throw new IllegalStateException("Failed to decode Firebase token");
            }
            
            String email = decodedToken.getEmail();
            
            if (email == null) {
                log.error("Email not provided in the token");
                throw new IllegalArgumentException("Email not provided in the token");
            }
            
            log.info("Successfully verified Firebase ID token for user: {}", email);
            
            // Check if the user exists in our system
            User user = masterService.getUserService().findByEmail(email);
            
            if (user == null) {
                // Create a new customer user with Firebase authentication
                log.info("User {} not found, creating new user", email);
                user = createNewFirebaseUser(decodedToken);
            } else {
                log.info("Found existing user for email: {}", email);
            }
            
            // Ensure the user is a customer role - only allow customer role for OAuth
            boolean isCustomer = user.getRoles().stream()
                    .anyMatch(role -> role.getName().equals("ROLE_" + UserType.CUSTOMER.name()));
            if (!isCustomer) {
                log.error("OAuth login attempt for non-customer role: {}", user.getRoles());
                throw new IllegalStateException("OAuth login is only allowed for customer accounts");
            }
            
            // Create login response
            LoginResponse response = LoginResponse.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRoles().stream().findFirst().map(Role::getName).orElse("ROLE_CUSTOMER"))
                    .build();
            
            // Generate JWT token
            String jwt = jwtService.generateToken(response);
            response.setAccessToken(jwt);
            
            log.info("Successfully generated JWT token for Firebase user: {}", email);
            
            return response;
        } catch (FirebaseAuthException e) {
            log.error("Firebase auth exception: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Error during Firebase authentication: {}", e.getMessage(), e);
            throw new IllegalStateException("Error during Firebase authentication: " + e.getMessage(), e);
        }
    }
    
    /**
     * Create a new user based on Firebase authentication information
     * @param token The decoded Firebase token
     * @return The newly created user
     */
    private User createNewFirebaseUser(FirebaseToken token) {
        String email = token.getEmail();
        String name = token.getName();
        
        // Split name into first and last name, defaulting if needed
        String firstName = name;
        String lastName = "";
        
        if (name != null && name.contains(" ")) {
            String[] nameParts = name.split(" ", 2);
            firstName = nameParts[0];
            lastName = nameParts[1];
        }
        
        // Create customer user with OAuth flag
        Customer newCustomer = new Customer();
        newCustomer.setEmail(email);
        newCustomer.setUsername(email.split("@")[0] + "_" + System.currentTimeMillis()); // Generate unique username
        newCustomer.setFirstName(firstName);
        newCustomer.setLastName(lastName);
        newCustomer.setOauthUser(true); // Mark as OAuth user
        
        // Add the customer through master service
        return masterService.getUserService().createFirebaseUser(newCustomer);
    }
}
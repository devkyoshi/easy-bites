package com.ds.masterservice.service;

import com.ds.masterservice.dao.authService.Customer;
import com.ds.masterservice.dao.authService.User;

public interface FirebaseUserService {
    
    /**
     * Find a user by email
     * @param email The email to search for
     * @return User if found, null otherwise
     */
    User findByEmail(String email);
    
    /**
     * Create a new user from Firebase authentication
     * @param customer The customer details from Firebase
     * @return The created user
     */
    User createFirebaseUser(Customer customer);
}
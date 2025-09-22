package com.ds.authservice.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@Configuration
@Slf4j
public class FirebaseConfig {

    @Value("${firebase.credentials.encoded:FIREBASE_CREDENTIALS_PLACEHOLDER}")
    private String firebaseCredentialsEncoded;

    @Value("${firebase.project.id}")
    private String projectId;

    @PostConstruct
    public void initialize() {
        try {
            // Check if Firebase app is already initialized to prevent errors on restart
            if (FirebaseApp.getApps().isEmpty()) {
                
                // For development/testing, we can use a placeholder configuration
                if (firebaseCredentialsEncoded == null || firebaseCredentialsEncoded.isEmpty() 
                    || "FIREBASE_CREDENTIALS_PLACEHOLDER".equals(firebaseCredentialsEncoded)) {
                    log.warn("Firebase credentials not configured. Using default configuration for development.");
                    
                    // Initialize with default options for development environment
                    // This allows basic initialization without a service account
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.getApplicationDefault())
                            .setProjectId(projectId)
                            .build();
                    
                    FirebaseApp.initializeApp(options);
                    log.info("Firebase has been initialized with default configuration");
                    return;
                }
                
                // Decode base64 encoded credentials for production
                byte[] decodedCredentials = Base64.getDecoder().decode(firebaseCredentialsEncoded);
                InputStream credentialsStream = new ByteArrayInputStream(decodedCredentials);
                
                // Initialize Firebase with the decoded credentials
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(credentialsStream))
                        .build();
                
                FirebaseApp.initializeApp(options);
                log.info("Firebase has been initialized successfully with provided credentials");
            } else {
                log.info("Firebase app already initialized");
            }
        } catch (IOException e) {
            log.error("Error initializing Firebase: {}", e.getMessage(), e);
            // Try to initialize with default configuration as fallback
            try {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .setProjectId(projectId) // Replace with your Firebase project ID
                        .build();
                
                FirebaseApp.initializeApp(options);
                log.info("Firebase has been initialized with fallback configuration");
            } catch (IOException ex) {
                log.error("Failed to initialize Firebase with fallback configuration: {}", ex.getMessage(), ex);
            }
        }
    }
}
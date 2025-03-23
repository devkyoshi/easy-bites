package com.ds.authservice.config;
import java.util.List;

public record CustomUserDetails(Long userId, String firstName, String lastName, String email, List<String> roles) {
}
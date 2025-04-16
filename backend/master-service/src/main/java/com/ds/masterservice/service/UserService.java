package com.ds.masterservice.service;

import com.ds.authservice.dto.RegisterUserRequest;
import com.ds.authservice.dto.UserResponseDTO;
import com.ds.commons.template.ApiResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService extends UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
    public ApiResponse<UserResponseDTO> registerUser(RegisterUserRequest registerRequest);
}

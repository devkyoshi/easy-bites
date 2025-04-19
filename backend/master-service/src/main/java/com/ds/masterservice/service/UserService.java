package com.ds.masterservice.service;



import com.ds.commons.dto.request.RegisterUserRequest;
import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public interface UserService extends UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
    ApiResponse<RegisterResponse> registerUser(RegisterUserRequest registerRequest) throws CustomException;
}

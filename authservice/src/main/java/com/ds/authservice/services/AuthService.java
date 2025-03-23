package com.ds.authservice.services;

import com.ds.authservice.dto.request.LoginRequest;
import com.ds.authservice.dto.request.UpdateRegisterUserRequest;
import com.ds.authservice.dto.response.LoginResponse;
import com.ds.authservice.dto.response.UserResponse;
import com.ds.authservice.utils.ApiResponse;

public interface AuthService {
    ApiResponse<UserResponse> registerUser(UpdateRegisterUserRequest updateRegisterUserRequest);
    ApiResponse<LoginResponse> login(LoginRequest loginRequest);
}

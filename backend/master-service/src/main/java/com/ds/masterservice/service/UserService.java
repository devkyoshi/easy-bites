package com.ds.masterservice.service;


import com.ds.commons.dto.request.LoginRequest;
import com.ds.commons.dto.request.RegisterUserRequest;

import com.ds.commons.dto.response.LoginResponse;
import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.RestaurantManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;



public interface UserService extends UserDetailsService {
    UserDetails loadUserByUsername(String username);
    ApiResponse<RegisterResponse> registerUser(RegisterUserRequest registerRequest) throws CustomException;
    ApiResponse<LoginResponse> loginUser(LoginRequest loginRequest) throws CustomException;
    RestaurantManager getRestaurantManagerByUserId(Integer userId) throws CustomException;
    ApiResponse<RegisterResponse> registerRestaurantManager(RegisterUserRequest restaurantManager) throws CustomException;
}

package com.ds.authservice.services;

import com.ds.authservice.config.JwtUtils;
import com.ds.authservice.dto.request.LoginRequest;
import com.ds.authservice.dto.request.RegisterUserRequest;
import com.ds.authservice.dto.response.LoginResponse;
import com.ds.authservice.dto.response.UserResponse;
import com.ds.authservice.exceptions.UserAlreadyExistsException;
import com.ds.authservice.factory.UserFactory;
import com.ds.authservice.models.Customer;
import com.ds.authservice.models.DeliveryPersonnel;
import com.ds.authservice.models.RestaurantManager;
import com.ds.authservice.models.User;
import com.ds.authservice.repositories.CustomerRepository;
import com.ds.authservice.repositories.DeliveryPersonnelRepository;
import com.ds.authservice.repositories.RestaurantManagerRepository;
import com.ds.authservice.repositories.UserRepository;
import com.ds.authservice.utils.ApiResponse;
import com.ds.authservice.utils.MessageConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final RestaurantManagerRepository restaurantManagerRepository;
    private final DeliveryPersonnelRepository deliveryPersonnelRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserFactory userFactory;
    private final JwtUtils jwtUtils;


    public ApiResponse<UserResponse> registerUser(RegisterUserRequest registerUserRequest) {
        if(userRepository.existsByUsername(registerUserRequest.getUsername())){
            log.error("Username {} already exists", registerUserRequest.getUsername());
            throw new UserAlreadyExistsException( registerUserRequest.getUsername());
        }

        //create user
        User user = userFactory.createUser(registerUserRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        switch (user) {
            case Customer customer -> customerRepository.save(customer);
            case RestaurantManager restaurantManager -> restaurantManagerRepository.save(restaurantManager);
            case DeliveryPersonnel deliveryPersonnel -> deliveryPersonnelRepository.save(deliveryPersonnel);
            default -> userRepository.save(user);
        }

        log.info("User registered successfully: {}", user.getUsername());
        UserResponse userResponse = new UserResponse( user.getId(), user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName());
        return ApiResponse.successResponse(MessageConstants.USER_REGISTERED_SUCCESSFULLY, userResponse);
    }

    public ApiResponse<LoginResponse> login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException(MessageConstants.INVALID_CREDENTIALS));

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())){
            log.error("Invalid password for user: {}", user.getUsername());
            throw new IllegalArgumentException(MessageConstants.INVALID_CREDENTIALS);
        }

        log.info("User logged in successfully: {}", user.getUsername());
        String token = jwtUtils.generateToken(user);
        UserResponse userResponse = new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getFirstName(), user.getLastName());

        LoginResponse loginResponse = new LoginResponse(token, userResponse);
        return ApiResponse.successResponse(MessageConstants.LOGIN_SUCCESSFUL, loginResponse);
    }


}

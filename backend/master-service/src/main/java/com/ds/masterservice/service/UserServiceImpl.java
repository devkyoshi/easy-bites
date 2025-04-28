package com.ds.masterservice.service;



import com.ds.commons.dto.request.LoginRequest;
import com.ds.commons.dto.request.RegisterUserRequest;

import com.ds.commons.dto.response.LoginResponse;
import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;

import com.ds.masterservice.dao.*;
import com.ds.masterservice.dao.deliveryService.DeliveryPerson;
import com.ds.masterservice.dto.request.deliveryService.DriverRegistrationRequest;
import com.ds.masterservice.dto.response.deliveryService.DriverResponse;
import com.ds.masterservice.repository.deliveryService.DeliveryDriverRepository;
import com.ds.masterservice.repository.RoleRepository;
import com.ds.masterservice.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import com.ds.commons.enums.UserType;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;


@Slf4j
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final DeliveryDriverRepository deliveryDriverRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, DeliveryDriverRepository deliveryDriverRepository, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.deliveryDriverRepository = deliveryDriverRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Override
    public ApiResponse<RegisterResponse> registerUser(RegisterUserRequest registerRequest) throws CustomException {
        try {
            // Check if required fields are present
            if (registerRequest.getUsername() == null ||
                    registerRequest.getPassword() == null ||
                    registerRequest.getEmail() == null ||
                    registerRequest.getFirstName() == null ||
                    registerRequest.getUserType() == null ||
                    registerRequest.getLastName() == null) {
                log.error("Request for registration received with missing required fields");
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }

            // Check if username already exists
            if (userRepository.findUserByUsername(registerRequest.getUsername()).isPresent()) {
                log.error("User with username {} already exists", registerRequest.getUsername());
                throw new CustomException(ExceptionCode.USER_ALREADY_EXISTS);
            }

            // Check if email already exists
            if (userRepository.findUserByEmail(registerRequest.getEmail()).isPresent()) {
                log.error("User with email {} already exists", registerRequest.getEmail());
                throw new CustomException(ExceptionCode.EMAIL_ALREADY_EXISTS);
            }

            UserType userType = registerRequest.getUserType();
            Role role = roleRepository.findByName("ROLE_" + userType.name())
                    .orElseThrow(() -> new CustomException(ExceptionCode.ROLE_NOT_FOUND));

            User user = switch (userType) {
                case CUSTOMER -> new Customer();
                case RESTAURANT_MANAGER -> new RestaurantManager();
                case DELIVERY_PERSON -> {
                    if (!(registerRequest instanceof DriverRegistrationRequest)) {
                        throw new CustomException(ExceptionCode.INVALID_REQUEST_TYPE);
                    }
                    yield new DeliveryPerson();
                }
                case SYSTEM_ADMIN -> new SystemAdmin();
                default -> throw new CustomException(ExceptionCode.INVALID_USER_TYPE);
            };

            // Set common user fields
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setUsername(registerRequest.getUsername());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setEmail(registerRequest.getEmail());
            user.setRoles(List.of(role));

            // Handle delivery person specific logic
            if (user instanceof DeliveryPerson dp && registerRequest instanceof DriverRegistrationRequest driverRequest) {
                // Validate required fields
                if (driverRequest.getVehicleType() == null ||
                        driverRequest.getLicenseNumber() == null ||
                        driverRequest.getVehicleNumber() == null) {
                    throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
                }

                dp.setVehicleType(driverRequest.getVehicleType());

                // Unique license/vehicle validation
                if (deliveryDriverRepository.existsByLicenseNumber(driverRequest.getLicenseNumber())) {
                    throw new CustomException(ExceptionCode.LICENSE_ALREADY_EXISTS);
                }
                if (deliveryDriverRepository.existsByVehicleNumber(driverRequest.getVehicleNumber())) {
                    throw new CustomException(ExceptionCode.VEHICLE_NUMBER_ALREADY_EXISTS);
                }

                dp.setLicenseNumber(driverRequest.getLicenseNumber());
                dp.setVehicleNumber(driverRequest.getVehicleNumber());
            }

            // Save the user to the database
            userRepository.save(user);
            log.info("User {} registered successfully", registerRequest.getUsername());

            // Return the response
            RegisterResponse response = getRegisterResponse(user);
            return ApiResponse.createdSuccessResponse("User Registered Successfully", response);
        } catch (CustomException e) {
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Database constraint violation during registration: {}", e.getMessage());
            throw new CustomException(ExceptionCode.EMAIL_ALREADY_EXISTS);
        } catch (Exception e) {
            log.error("An error occurred during registration: {}", e.getMessage());
            throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ApiResponse<LoginResponse> loginUser(LoginRequest loginRequest) throws CustomException {
       try{
           // Check if required fields are present
           if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
               log.error( "Request for login received with missing required fields");
               throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
           }

           User user = getUserByUsername(loginRequest.getUsername());

           if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                log.error("Invalid credentials for user: {}", loginRequest.getUsername());
               throw new CustomException(ExceptionCode.INVALID_CREDENTIALS);
           }

           LoginResponse loginResponse = LoginResponse.builder()
                   .userId(user.getId())
                   .username(user.getUsername())
                   .firstName( user.getFirstName())
                   .lastName(user.getLastName())
                   .email(user.getEmail())
                   .role(user.getRoles().stream().map(Role::getName).findFirst().orElse(null))
                   .build();

           return ApiResponse.successResponse("Login successful", loginResponse);
       } catch (Exception e) {
              if (e instanceof CustomException) {
                throw (CustomException) e;
              } else {
                log.error("An error occurred during login: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
              }
       }
    }

    @Override
    public RestaurantManager getRestaurantManagerByUserId(Integer userId) throws CustomException {

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.USER_NOT_FOUND));

            if (!(user instanceof RestaurantManager)) {
                throw new CustomException(ExceptionCode.USER_NOT_FOUND);
            }

            return (RestaurantManager) user;
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while fetching the restaurant manager: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    private User getUserByUsername(String username) throws CustomException {
        return userRepository.findUserByUsername(username).orElseThrow(
                () -> new CustomException(ExceptionCode.USER_NOT_FOUND)
        );
    }


    //Helper methods
    private RegisterResponse getRegisterResponse(User user) {
        RegisterResponse.RegisterResponseBuilder<?, ?> baseBuilder = RegisterResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getUsername())
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt());

        if (user instanceof DeliveryPerson dp) {
            return DriverResponse.builder()
                    .firstName(dp.getFirstName())
                    .lastName(dp.getLastName())
                    .email(dp.getEmail())
                    .username(dp.getUsername())
                    .roles(dp.getRoles().stream().map(Role::getName).toList())
                    .createdAt(dp.getCreatedAt())
                    .updatedAt(dp.getUpdatedAt())
                    .vehicleType(dp.getVehicleType().name())
                    .vehicleNumber(dp.getVehicleNumber())
                    .isAvailable(dp.getIsAvailable()) // assuming you have this field
                    .build();
        }

        return baseBuilder.build();
    }

    private DriverRegistrationRequest convertToDriverRegistrationRequest(RegisterUserRequest request) throws CustomException {
        try {
            return objectMapper.convertValue(request, DriverRegistrationRequest.class);
        } catch (IllegalArgumentException e) {
            log.error("Failed to convert RegisterUserRequest to DriverRegistrationRequest: {}", e.getMessage());
            throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
        }
    }

}

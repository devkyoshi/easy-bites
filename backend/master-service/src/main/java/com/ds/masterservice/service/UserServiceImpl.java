package com.ds.masterservice.service;



import com.ds.commons.dto.request.LoginRequest;
import com.ds.commons.dto.request.RegisterUserRequest;

import com.ds.commons.dto.response.LoginResponse;
import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;

import com.ds.masterservice.dao.*;
import com.ds.masterservice.repository.RoleRepository;
import com.ds.masterservice.repository.StaffRegistrationRepository;
import com.ds.masterservice.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import com.ds.commons.enums.UserType;
import org.springframework.beans.factory.annotation.Autowired;



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


    private final  StaffRegistrationRepository staffRegistrationRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder, StaffRegistrationRepository staffRegistrationRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.staffRegistrationRepository = staffRegistrationRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }

    @Override
    public ApiResponse<RegisterResponse> registerUser(RegisterUserRequest registerRequest) throws CustomException {
        try{
            //Check if required fields are present
            if (registerRequest.getUsername() == null ||
                    registerRequest.getPassword() == null ||
                    registerRequest.getEmail() == null ||
                    registerRequest.getFirstName() == null ||
                    registerRequest.getLastName() == null) {
                log.error("Request for registration received with missing required fields");
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }

            // Check if the user already exists
            if (userRepository.findUserByUsername(registerRequest.getUsername()).isPresent()) {
                log.error("User with username {} already exists", registerRequest.getUsername());
                 throw new CustomException(ExceptionCode.USER_ALREADY_EXISTS);
            }

            UserType userType = registerRequest.getUserType() == null ? UserType.CUSTOMER : registerRequest.getUserType();
            Role role = roleRepository.findByName("ROLE_" + userType.name())
                    .orElseThrow(() -> new CustomException(ExceptionCode.ROLE_NOT_FOUND));

            // Create a new user
            User user = switch (userType) {
                case CUSTOMER -> new Customer();
                case RESTAURANT_MANAGER -> new RestaurantManager();
                case DELIVERY_PERSON -> new DeliveryPerson();
                case SYSTEM_ADMIN -> new SystemAdmin();
                default -> throw new CustomException(ExceptionCode.INVALID_USER_TYPE);
            };


            switch (user) {
                case DeliveryPerson deliveryPerson -> {
                    deliveryPerson.setVehicleType(registerRequest.getVehicleType());
                    deliveryPerson.setLicenseNumber(registerRequest.getLicenseNumber());
                }
                default -> {
                    // No additional fields to set for other user types
                }
            }


            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setUsername(registerRequest.getUsername());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setEmail(registerRequest.getEmail());
            user.setRoles(List.of(role));

            // Save the user to the database
            userRepository.save(user);
            log.info("User {} registered successfully", registerRequest.getUsername());

            // Return the response
            return ApiResponse.createdSuccessResponse("User Registered Successfully", getRegisterResponse(user));
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred during registration: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
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

    @Override
    public ApiResponse<RegisterResponse> registerRestaurantManager(RegisterUserRequest restaurantManager) throws CustomException {

        try {
            // Check if required fields are present
            if (restaurantManager.getUsername() == null ||
                    restaurantManager.getPassword() == null ||
                    restaurantManager.getEmail() == null ||
                    restaurantManager.getFirstName() == null ||
                    restaurantManager.getUserType() == null ||
                    restaurantManager.getLastName() == null) {
                log.error("Request for registration received with missing required fields");
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }

            // Check if the user already exists
            if (userRepository.findUserByUsername(restaurantManager.getUsername()).isPresent()) {
                log.error("User with username {} already exists", restaurantManager.getUsername());
                throw new CustomException(ExceptionCode.USER_ALREADY_EXISTS);
            }

            // Create a new Restaurant Manager
            RestaurantManager user = new RestaurantManager();
            user.setFirstName(restaurantManager.getFirstName());
            user.setLastName(restaurantManager.getLastName());
            user.setUsername(restaurantManager.getUsername());
            user.setPassword(passwordEncoder.encode(restaurantManager.getPassword()));
            user.setEmail(restaurantManager.getEmail());
            user.setRoles(List.of(roleRepository.findByName("ROLE_RESTAURANT_MANAGER")
                    .orElseThrow(() -> new CustomException(ExceptionCode.ROLE_NOT_FOUND))));

            if(restaurantManager.getLicenseNumber() != null) {
                user.setLicenseNumber(restaurantManager.getLicenseNumber());
            }

            // Save the user to the database
            User savedUser = userRepository.save(user);

            StaffRegistration staffRegistration = new StaffRegistration();
            staffRegistration.setUser(savedUser);
            staffRegistration.setCreatedAt( user.getCreatedAt());
            staffRegistration.setIsApproved(false);

            staffRegistrationRepository.save(staffRegistration);
            log.info("Restaurant Manager {} registered successfully", restaurantManager.getUsername());

            // Return the response
            return ApiResponse.createdSuccessResponse("Restaurant Manager Registered Successfully", getRegisterResponse(user));
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred during registration: {}", e.getMessage());
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
        return RegisterResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getUsername())
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

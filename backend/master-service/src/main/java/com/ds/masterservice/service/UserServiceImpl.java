package com.ds.masterservice.service;


import com.ds.commons.dto.request.RegisterUserRequest;
import com.ds.commons.dto.response.RegisterResponse;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.User;
import com.ds.masterservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserByUsername(username);
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
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }

            // Check if the user already exists
            if (userRepository.findUserByUsername(registerRequest.getUsername()) != null) {
                 throw new CustomException(ExceptionCode.USER_ALREADY_EXISTS);
            }

            // Create a new user
            User user = new User();
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setUsername(registerRequest.getUsername());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setEmail(registerRequest.getEmail());
            //TODO: Should add roles and permissions here.

            // Save the user to the database
            userRepository.save(user);

            // Return the response
            return ApiResponse.successResponse(getRegisterResponse(user));
        } catch (Exception e) {
            // Handle any exceptions that occur during registration
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }


    //Helper methods

    private RegisterResponse getRegisterResponse(User user) {
        return RegisterResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .username(user.getUsername())
                .roles(null) //TODO: Add roles and permissions here
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

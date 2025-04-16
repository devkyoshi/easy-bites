package com.ds.masterservice.service;

import com.ds.authservice.dto.RegisterUserRequest;
import com.ds.authservice.dto.UserResponseDTO;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.User;
import com.ds.masterservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findUserByUsername(username);
    }

    @Override
    public ApiResponse<UserResponseDTO> registerUser(RegisterUserRequest registerRequest) {
        try{

            //Check if required fields are present
            if (registerRequest.getUsername() == null || registerRequest.getPassword() == null) {
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
            user.setPassword(registerRequest.getPassword());
            user.setEmail(registerRequest.getEmail());
            //TODO: Should add roles and permissions here.

            // Save the user to the database
            userRepository.save(user);
            return null;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

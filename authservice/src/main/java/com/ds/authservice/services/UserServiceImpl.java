package com.ds.authservice.services;

import com.ds.authservice.config.CustomUserDetails;
import com.ds.authservice.dto.request.UpdateRegisterCustomerRequest;
import com.ds.authservice.dto.request.UpdateRegisterDeliveryPersonnelRequest;
import com.ds.authservice.dto.request.UpdateRegisterRestaurantManagerRequest;

import com.ds.authservice.dto.response.CustomerUserResponse;
import com.ds.authservice.dto.response.DeliveryPersonResponse;
import com.ds.authservice.dto.response.RestaurantManagerResponse;

import com.ds.authservice.exceptions.InvalidUserInputException;
import com.ds.authservice.exceptions.UserNotFoundException;
import com.ds.authservice.factory.UserFactory;
import com.ds.authservice.models.Customer;
import com.ds.authservice.models.DeliveryPersonnel;
import com.ds.authservice.models.ERole;
import com.ds.authservice.models.RestaurantManager;

import com.ds.authservice.repositories.CustomerRepository;
import com.ds.authservice.repositories.DeliveryPersonnelRepository;
import com.ds.authservice.repositories.RestaurantManagerRepository;

import com.ds.authservice.utils.ApiResponse;
import com.ds.authservice.utils.MessageConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.function.Function;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final CustomerRepository customerRepository;
    private final DeliveryPersonnelRepository deliveryPersonnelRepository;
    private final RestaurantManagerRepository restaurantManagerRepository;
    private final UserFactory userFactory;

    @Override
    public ApiResponse<CustomerUserResponse> updateCustomer(UpdateRegisterCustomerRequest request, Long userId) {

        if(userId == null) {
            log.info("Update customer request failed. User ID cannot be null");
            throw new InvalidUserInputException("User ID cannot be null");
        }

        Optional<Customer> customer = customerRepository.findById(userId);

        if(customer.isEmpty()) {
            log.info("Update customer request failed. User not found with userID: {}", userId);
            throw new UserNotFoundException("Customer not found");
        }

        Customer updatedCustomer = userFactory.updateCustomer(customer.get(), request);

        if(request.getPassword() != null) {
            updatedCustomer.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        customerRepository.save(updatedCustomer);

        log.info("Update customer successfully with ID: {}", userId);
        CustomerUserResponse customerUserResponse = new CustomerUserResponse(updatedCustomer);
        return  ApiResponse.successResponse(MessageConstants.CUSTOMER_UPDATED_SUCCESSFULLY, customerUserResponse);
    }

    @Override
    public ApiResponse<RestaurantManagerResponse> updateRestaurantManager(UpdateRegisterRestaurantManagerRequest request, Long userId) {

        if(userId == null) {
            log.info("Update restaurant manager request failed. User ID cannot be null");
            throw new InvalidUserInputException("User ID cannot be null");
        }

        Optional<RestaurantManager> restaurantManager = restaurantManagerRepository.findById(userId);

        if(restaurantManager.isEmpty()) {
            log.info("Update restaurant manager request failed. User not found with userID: {}", userId);
            throw new UserNotFoundException("Restaurant Manager not found");
        }

        RestaurantManager updatedRestaurantManager = userFactory.updateRestaurantManager(restaurantManager.get(), request);
        if(request.getPassword() != null) {
            updatedRestaurantManager.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        restaurantManagerRepository.save(updatedRestaurantManager);

        log.info("Update restaurant manager successfully with ID: {}", userId);
        RestaurantManagerResponse restaurantManagerResponse = new RestaurantManagerResponse(updatedRestaurantManager);
        return  ApiResponse.successResponse(MessageConstants.RESTAURANT_MANAGER_UPDATED_SUCCESSFULLY, restaurantManagerResponse);
    }

    @Override
    public ApiResponse<DeliveryPersonResponse> updateDeliveryPersonnel(UpdateRegisterDeliveryPersonnelRequest request, Long userId) {

        if(userId == null) {
            log.info("Update delivery personnel request failed. User ID cannot be null");
            throw new InvalidUserInputException("User ID cannot be null");
        }

        Optional<DeliveryPersonnel> deliveryPersonnel = deliveryPersonnelRepository.findById(userId);

        if(deliveryPersonnel.isEmpty()) {
            log.info("Update delivery personnel request failed. User not found with userID: {}", userId);
            throw new UserNotFoundException("Delivery Personnel not found");
        }

        DeliveryPersonnel updatedDeliveryPersonnel = userFactory.updateDeliveryPersonnel(deliveryPersonnel.get(), request);
        if(request.getPassword() != null) {
            updatedDeliveryPersonnel.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        deliveryPersonnelRepository.save(updatedDeliveryPersonnel);

        log.info("Updated delivery personnel successfully with ID: {}", userId);
        DeliveryPersonResponse deliveryPersonResponse = new DeliveryPersonResponse(updatedDeliveryPersonnel);
        return  ApiResponse.successResponse(MessageConstants.DELIVERY_PERSONNEL_UPDATED_SUCCESSFULLY, deliveryPersonResponse);
    }

    @Override
    public ApiResponse<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            log.info("Get user profile request failed. User not authenticated");
            throw new UserNotFoundException("User not authenticated");
        }

        Long userId = userDetails.userId();
        ERole userRole = ERole.valueOf(userDetails.roles().getFirst());

        return switch (userRole) {
            case ROLE_CUSTOMER -> handleUserProfile(
                    customerRepository.findById(userId),
                    CustomerUserResponse::new,
                    "Customer",
                    userId
            );
            case ROLE_RESTAURANT_ADMIN -> handleUserProfile(
                    restaurantManagerRepository.findById(userId),
                    RestaurantManagerResponse::new,
                    "Restaurant Manager",
                    userId
            );
            case ROLE_DELIVERY_PERSONNEL -> handleUserProfile(
                    deliveryPersonnelRepository.findById(userId),
                    DeliveryPersonResponse::new,
                    "Delivery Personnel",
                    userId
            );
            default -> {
                log.info("Get user profile request failed. Invalid user role");
                throw new InvalidUserInputException(MessageConstants.INVALID_USER_ROLE);
            }
        };
    }

    @Override
    public ApiResponse<?> removeAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            log.info("Remove account request failed. User not authenticated");
            throw new UserNotFoundException("User not authenticated");
        }

        Long userId = userDetails.userId();
        ERole userRole = ERole.valueOf(userDetails.roles().getFirst());

        switch (userRole) {
            case ROLE_CUSTOMER -> {
                customerRepository.deleteById(userId);
                log.info("Customer account removed successfully with ID: {}", userId);
            }
            case ROLE_RESTAURANT_ADMIN -> {
                restaurantManagerRepository.deleteById(userId);
                log.info("Restaurant Manager account removed successfully with ID: {}", userId);
            }
            case ROLE_DELIVERY_PERSONNEL -> {
                deliveryPersonnelRepository.deleteById(userId);
                log.info("Delivery Personnel account removed successfully with ID: {}", userId);
            }
            default -> {
                log.info("Remove account request failed. Invalid user role");
                throw new InvalidUserInputException(MessageConstants.INVALID_USER_ROLE);
            }
        }

        return ApiResponse.successResponse(MessageConstants.ACCOUNT_REMOVED_SUCCESSFULLY, null);
    }

    @Override
    public ApiResponse<?> removeUserById(Long userId) {

        if(userId == null) {
            log.info("Remove user request failed. User ID cannot be null");
            throw new InvalidUserInputException("User ID cannot be null");
        }

        Optional<Customer> customer = customerRepository.findById(userId);
        Optional<RestaurantManager> restaurantManager = restaurantManagerRepository.findById(userId);
        Optional<DeliveryPersonnel> deliveryPersonnel = deliveryPersonnelRepository.findById(userId);

        if(customer.isPresent()) {
            customerRepository.deleteById(userId);
            log.info("Customer removed successfully with ID: {}", userId);
        } else if(restaurantManager.isPresent()) {
            restaurantManagerRepository.deleteById(userId);
            log.info("Restaurant Manager removed successfully with ID: {}", userId);
        } else if(deliveryPersonnel.isPresent()) {
            deliveryPersonnelRepository.deleteById(userId);
            log.info("Delivery Personnel removed successfully with ID: {}", userId);
        } else {
            log.info("Remove user request failed. User not found with userID: {}", userId);
            throw new UserNotFoundException("User not found");
        }

        return ApiResponse.successResponse(MessageConstants.ACCOUNT_REMOVED_SUCCESSFULLY, null);
    }

    private <T, R> ApiResponse<?> handleUserProfile(Optional<T> entityOptional,
                                                    Function<T, R> responseMapper,
                                                    String roleType, Long userId) {
        T entity = entityOptional.orElseThrow(() -> {
            log.info("Get user profile request failed. {} not found with userID: {}", roleType, userId);
            return new UserNotFoundException(roleType + " not found");
        });

        log.info("Get user profile successfully with ID: {}", userId);
        return ApiResponse.successResponse(
                MessageConstants.USER_PROFILE_FETCHED_SUCCESSFULLY,
                responseMapper.apply(entity)
        );
    }

}

package com.ds.authservice.services;

import com.ds.authservice.dto.request.UpdateRegisterCustomerRequest;
import com.ds.authservice.dto.request.UpdateRegisterDeliveryPersonnelRequest;
import com.ds.authservice.dto.request.UpdateRegisterRestaurantManagerRequest;
import com.ds.authservice.dto.response.CustomerUserResponse;
import com.ds.authservice.dto.response.DeliveryPersonResponse;
import com.ds.authservice.dto.response.RestaurantManagerResponse;
import com.ds.authservice.utils.ApiResponse;

public interface UserService {
     ApiResponse<CustomerUserResponse> updateCustomer(UpdateRegisterCustomerRequest request, Long userId);
     ApiResponse<RestaurantManagerResponse> updateRestaurantManager(UpdateRegisterRestaurantManagerRequest request, Long userId);
     ApiResponse<DeliveryPersonResponse> updateDeliveryPersonnel(UpdateRegisterDeliveryPersonnelRequest request, Long userId);
     ApiResponse<?> getUserProfile();
     ApiResponse<?> removeAccount();
     ApiResponse<?> removeUserById(Long userId);
}

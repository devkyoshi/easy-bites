package com.ds.authservice.factory;

import com.ds.authservice.dto.request.RegisterCustomerRequest;
import com.ds.authservice.dto.request.RegisterDeliveryPersonnelRequest;
import com.ds.authservice.dto.request.RegisterRestaurantManagerRequest;
import com.ds.authservice.dto.request.RegisterUserRequest;
import com.ds.authservice.models.Customer;
import com.ds.authservice.models.DeliveryPersonnel;
import com.ds.authservice.models.RestaurantManager;
import com.ds.authservice.models.User;
import org.springframework.stereotype.Component;

@Component
public class UserFactory {

    public User createUser(RegisterUserRequest registerUserRequest) {
       if(registerUserRequest instanceof RegisterCustomerRequest customerRequest){
           return Customer.builder()
                   .firstName(customerRequest.getFirstName())
                   .lastName(customerRequest.getLastName())
                   .email(customerRequest.getEmail())
                   .username(customerRequest.getUsername())
                   .password(customerRequest.getPassword())
                   .address(customerRequest.getAddress())
                   .phoneNumber(customerRequest.getPhoneNumber())
                   .build();
       }

      if(registerUserRequest instanceof RegisterRestaurantManagerRequest adminRequest){
           return RestaurantManager.builder()
                   .firstName(adminRequest.getFirstName())
                   .lastName(adminRequest.getLastName())
                   .email(adminRequest.getEmail())
                   .username(adminRequest.getUsername())
                   .password(adminRequest.getPassword())
                   .businessLicense(adminRequest.getBusinessLicense())
                   .restaurantName(adminRequest.getRestaurantName())
                   .build();
       }

      if(registerUserRequest instanceof RegisterDeliveryPersonnelRequest deliveryRequest){
          return DeliveryPersonnel.builder()
                  .firstName(deliveryRequest.getFirstName())
                  .lastName(deliveryRequest.getLastName())
                  .email(deliveryRequest.getEmail())
                  .password(deliveryRequest.getPassword())
                  .licenseNumber(deliveryRequest.getLicenseNumber())
                  .vehicleType(deliveryRequest.getVehicleType())
                  .build();
      }

      throw new IllegalArgumentException("Invalid user type");
    }
}

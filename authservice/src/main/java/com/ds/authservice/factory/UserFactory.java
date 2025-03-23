package com.ds.authservice.factory;

import com.ds.authservice.dto.request.UpdateRegisterCustomerRequest;
import com.ds.authservice.dto.request.UpdateRegisterDeliveryPersonnelRequest;
import com.ds.authservice.dto.request.UpdateRegisterRestaurantManagerRequest;
import com.ds.authservice.dto.request.UpdateRegisterUserRequest;
import com.ds.authservice.exceptions.InvalidUserRoleException;
import com.ds.authservice.models.Customer;
import com.ds.authservice.models.DeliveryPersonnel;
import com.ds.authservice.models.RestaurantManager;
import com.ds.authservice.models.User;
import org.springframework.stereotype.Component;

@Component
public class UserFactory {


    public User createUser(UpdateRegisterUserRequest updateRegisterUserRequest) {
       if(updateRegisterUserRequest instanceof UpdateRegisterCustomerRequest customerRequest){
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

      if(updateRegisterUserRequest instanceof UpdateRegisterRestaurantManagerRequest adminRequest){
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

      if(updateRegisterUserRequest instanceof UpdateRegisterDeliveryPersonnelRequest deliveryRequest){
          return DeliveryPersonnel.builder()
                  .firstName(deliveryRequest.getFirstName())
                  .lastName(deliveryRequest.getLastName())
                  .email(deliveryRequest.getEmail())
                  .password(deliveryRequest.getPassword())
                  .licenseNumber(deliveryRequest.getLicenseNumber())
                  .vehicleType(deliveryRequest.getVehicleType())
                  .build();
      }

      throw new InvalidUserRoleException();
    }

    public Customer updateCustomer(Customer customer, UpdateRegisterCustomerRequest customerRequest) {
        if (customerRequest.getPassword() != null) {
            customer.setPassword(customerRequest.getPassword());
        }
        if (customerRequest.getFirstName() != null) {
            customer.setFirstName(customerRequest.getFirstName());
        }
        if (customerRequest.getLastName() != null) {
            customer.setLastName(customerRequest.getLastName());
        }
        if (customerRequest.getEmail() != null) {
            customer.setEmail(customerRequest.getEmail());
        }
        if (customerRequest.getUsername() != null) {
            customer.setUsername(customerRequest.getUsername());
        }
        if (customerRequest.getAddress() != null) {
            customer.setAddress(customerRequest.getAddress());
        }
        if (customerRequest.getPhoneNumber() != null) {
            customer.setPhoneNumber(customerRequest.getPhoneNumber());
        }

        return customer;
    }

    public RestaurantManager updateRestaurantManager(RestaurantManager restaurantManager, UpdateRegisterRestaurantManagerRequest adminRequest) {
        if (adminRequest.getPassword() != null) {
            restaurantManager.setPassword(adminRequest.getPassword());
        }
        if (adminRequest.getFirstName() != null) {
            restaurantManager.setFirstName(adminRequest.getFirstName());
        }
        if (adminRequest.getLastName() != null) {
            restaurantManager.setLastName(adminRequest.getLastName());
        }
        if (adminRequest.getEmail() != null) {
            restaurantManager.setEmail(adminRequest.getEmail());
        }
        if (adminRequest.getUsername() != null) {
            restaurantManager.setUsername(adminRequest.getUsername());
        }
        if (adminRequest.getBusinessLicense() != null) {
            restaurantManager.setBusinessLicense(adminRequest.getBusinessLicense());
        }
        if (adminRequest.getRestaurantName() != null) {
            restaurantManager.setRestaurantName(adminRequest.getRestaurantName());
        }

        return restaurantManager;
    }

    public DeliveryPersonnel updateDeliveryPersonnel(DeliveryPersonnel deliveryPersonnel, UpdateRegisterDeliveryPersonnelRequest deliveryRequest) {
        if (deliveryRequest.getPassword() != null) {
            deliveryPersonnel.setPassword(deliveryRequest.getPassword());
        }
        if (deliveryRequest.getFirstName() != null) {
            deliveryPersonnel.setFirstName(deliveryRequest.getFirstName());
        }
        if (deliveryRequest.getLastName() != null) {
            deliveryPersonnel.setLastName(deliveryRequest.getLastName());
        }
        if (deliveryRequest.getEmail() != null) {
            deliveryPersonnel.setEmail(deliveryRequest.getEmail());
        }
        if (deliveryRequest.getLicenseNumber() != null) {
            deliveryPersonnel.setLicenseNumber(deliveryRequest.getLicenseNumber());
        }
        if (deliveryRequest.getVehicleType() != null) {
            deliveryPersonnel.setVehicleType(deliveryRequest.getVehicleType());
        }

        return deliveryPersonnel;
    }



}

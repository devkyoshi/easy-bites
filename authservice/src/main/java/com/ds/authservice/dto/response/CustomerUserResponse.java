package com.ds.authservice.dto.response;

import com.ds.authservice.models.Customer;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CustomerUserResponse extends UserResponse{

    private String address;
    private String phoneNumber;

    public CustomerUserResponse(Customer customer) {
        super(customer.getId(), customer.getUsername(), customer.getEmail(), customer.getFirstName(), customer.getLastName());
        this.address = customer.getAddress();
        this.phoneNumber = customer.getPhoneNumber();
    }
}

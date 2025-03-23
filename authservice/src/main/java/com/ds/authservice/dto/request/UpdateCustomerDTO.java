package com.ds.authservice.dto.request;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCustomerDTO extends UpdateRegisterUserRequest {
    private String address;
    private String phoneNumber;
}

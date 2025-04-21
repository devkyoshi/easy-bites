package com.ds.masterservice.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class RestaurantCreateUpdateRequest {
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private String logoUrl;
    private Boolean isOpen;
    private String openingHour;
    private String closingHour;
    private List<String> daysOpen;
    private Integer managerId;
}

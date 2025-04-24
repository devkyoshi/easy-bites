package com.ds.masterservice.service;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dto.request.DriverRegistrationRequest;
import com.ds.masterservice.dto.response.DriverResponse;

import java.math.BigDecimal;
import java.util.List;

public interface DeliveryDriverService {
    ApiResponse<List<DriverResponse>> getAllDrivers() throws CustomException;
    ApiResponse<DriverResponse> updateDriver(Long driverId, DriverRegistrationRequest registrationDTO) throws CustomException;
    ApiResponse<String> deleteDriver(Long driverId) throws CustomException;
    ApiResponse<String> updateLocation(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException;
    ApiResponse<String> setDriverAvailability(Long driverId, boolean isAvailable) throws CustomException;
    ApiResponse<List<DriverResponse>> getAvailableDrivers() throws CustomException;
}

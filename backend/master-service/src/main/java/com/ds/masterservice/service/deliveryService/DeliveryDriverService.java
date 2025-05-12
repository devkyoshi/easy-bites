package com.ds.masterservice.service.deliveryService;

import com.ds.commons.exception.CustomException;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dto.request.deliveryService.DriverRegistrationRequest;
import com.ds.masterservice.dto.response.deliveryService.DriverResponse;
import com.ds.masterservice.dto.response.deliveryService.LocationUpdateResponse;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service interface for managing delivery drivers.
 */
public interface DeliveryDriverService {

    /**
     * Retrieve a list of all registered delivery drivers.
     *
     * @return ApiResponse containing a list of DriverResponse objects
     * @throws CustomException if any error occurs during retrieval
     */
    ApiResponse<List<DriverResponse>> getAllDrivers() throws CustomException;

    /**
     * Retrieve details of a specific delivery driver by ID.
     *
     * @param driverId unique identifier of the driver
     * @return ApiResponse containing DriverResponse with driver details
     * @throws CustomException if the driver is not found or retrieval fails
     */
    ApiResponse<DriverResponse> getDriver(Long driverId) throws CustomException;

    /**
     * Update the details of a delivery driver.
     *
     * @param driverId         unique identifier of the driver
     * @param registrationDTO  updated driver registration data
     * @return ApiResponse containing the updated DriverResponse
     * @throws CustomException if update fails or driver is not found
     */
    ApiResponse<DriverResponse> updateDriver(Long driverId, DriverRegistrationRequest registrationDTO) throws CustomException;

    /**
     * Delete a delivery driver by ID.
     *
     * @param driverId unique identifier of the driver to delete
     * @return ApiResponse containing success message if deletion is successful
     * @throws CustomException if the driver cannot be deleted or is not found
     */
    ApiResponse<String> deleteDriver(Long driverId) throws CustomException;

    /**
     * Update the current location of a delivery driver.
     *
     * @param driverId unique identifier of the driver
     * @param lat      new latitude of the driver
     * @param lng      new longitude of the driver
     * @return ApiResponse containing updated location details
     * @throws CustomException if location update fails
     */
    ApiResponse<LocationUpdateResponse> updateLocation(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException;

    /**
     * Set the availability status of a delivery driver.
     *
     * @param driverId    unique identifier of the driver
     * @param isAvailable true if the driver is available, false otherwise
     * @return ApiResponse containing success message
     * @throws CustomException if update fails
     */
    ApiResponse<String> setDriverAvailability(Long driverId, boolean isAvailable) throws CustomException;

    /**
     * Retrieve a list of currently available delivery drivers.
     *
     * @return ApiResponse containing a list of available DriverResponse objects
     * @throws CustomException if retrieval fails
     */
    ApiResponse<List<DriverResponse>> getAvailableDrivers() throws CustomException;
}

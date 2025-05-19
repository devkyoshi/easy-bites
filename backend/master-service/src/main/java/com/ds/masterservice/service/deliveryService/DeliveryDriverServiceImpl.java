package com.ds.masterservice.service.deliveryService;

import com.ds.commons.enums.VehicleType;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.NotFoundException;
import com.ds.commons.exception.NoContentException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.deliveryService.DeliveryPerson;
import com.ds.masterservice.dto.request.deliveryService.DriverRegistrationRequest;
import com.ds.masterservice.dto.response.deliveryService.DriverResponse;
import com.ds.masterservice.dto.response.deliveryService.LocationUpdateResponse;
import com.ds.masterservice.repository.deliveryService.DeliveryDriverRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of the DeliveryDriverService interface for managing delivery driver operations.
 */
@Slf4j
@Service
public class DeliveryDriverServiceImpl implements DeliveryDriverService {

    private final DeliveryDriverRepository deliveryDriverRepository;

    @Autowired
    public DeliveryDriverServiceImpl(DeliveryDriverRepository deliveryDriverRepository) {
        this.deliveryDriverRepository = deliveryDriverRepository;
    }

    /**
     * Fetches all registered delivery drivers.
     *
     * @return ApiResponse containing a list of DriverResponse
     * @throws CustomException if retrieval fails
     */
    @Override
    public ApiResponse<List<DriverResponse>> getAllDrivers() throws CustomException {
        log.info("Fetching all drivers");
        List<DriverResponse> drivers = deliveryDriverRepository.findAll()
                .stream()
                .map(this::mapToDriverResponse)
                .toList();
        log.debug("Total drivers found: {}", drivers.size());
        return ApiResponse.successResponse("Drivers fetched successfully", drivers);
    }

    /**
     * Fetch a specific driver by ID.
     *
     * @param driverId the driver's ID
     * @return ApiResponse containing the DriverResponse
     * @throws CustomException if the driver is not found
     */
    @Override
    public ApiResponse<DriverResponse> getDriver(Long driverId) throws CustomException {
        log.info("Fetching driver with ID: {}", driverId);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found", driverId);
                    return new NotFoundException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        return ApiResponse.successResponse("Driver fetched successfully", mapToDriverResponse(driver));
    }

    /**
     * Update driver profile with new details.
     *
     * @param driverId   the driver's ID
     * @param updateDTO  updated registration information
     * @return ApiResponse containing updated DriverResponse
     * @throws CustomException if the driver is not found or update fails
     */
    @Override
    public ApiResponse<DriverResponse> updateDriver(Long driverId, DriverRegistrationRequest updateDTO) throws CustomException {
        log.info("Updating driver with ID: {}", driverId);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found", driverId);
                    return new NotFoundException(ExceptionCode.DRIVER_NOT_FOUND);
                });
        try {
            VehicleType vehicleType = updateDTO.getVehicleType();
            driver.setVehicleType(vehicleType);
        } catch (IllegalArgumentException e) {
            log.error("Invalid vehicle type: {}", updateDTO.getVehicleType());
            throw new CustomException(ExceptionCode.INVALID_VEHICLE_TYPE);
        }

        driver.setLicenseNumber(updateDTO.getLicenseNumber());
        driver.setVehicleNumber(updateDTO.getVehicleNumber());

        DeliveryPerson updated = deliveryDriverRepository.save(driver);
        log.info("Driver with ID {} updated successfully", driverId);
        return ApiResponse.successResponse("Driver updated successfully", mapToDriverResponse(updated));
    }

    /**
     * Delete a driver by ID.
     *
     * @param driverId the driver's ID
     * @return ApiResponse with confirmation message
     * @throws CustomException if the driver is not found
     */
    @Override
    public ApiResponse<String> deleteDriver(Long driverId) throws CustomException {
        log.info("Deleting driver with ID: {}", driverId);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for deletion", driverId);
                    return new NotFoundException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        deliveryDriverRepository.delete(driver);
        log.info("Driver with ID {} deleted", driverId);
        return ApiResponse.successResponse("Driver deleted successfully", null);
    }

    /**
     * Update a driver's current geographic location.
     *
     * @param driverId the driver's ID
     * @param lat      latitude
     * @param lng      longitude
     * @return ApiResponse containing updated location data
     * @throws CustomException if the driver is not found
     */
    @Override
    public ApiResponse<LocationUpdateResponse> updateLocation(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException {
        log.info("Updating location for driver ID: {}", driverId);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for location update", driverId);
                    return new NotFoundException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        driver.setCurrentLat(lat);
        driver.setCurrentLng(lng);
        deliveryDriverRepository.save(driver);

        LocationUpdateResponse response = new LocationUpdateResponse();
        response.setDriverID(driverId);
        response.setLatitude(lat);
        response.setLongitude(lng);
        response.setMessage("Driver location updated successfully");
        response.setTimestamp(LocalDateTime.now());

        log.debug("Driver {} location updated to lat: {}, lng: {}", driverId, lat, lng);
        return ApiResponse.successResponse("Location updated", response);
    }

    /**
     * Set a driver's availability status.
     *
     * @param driverId     the driver's ID
     * @param isAvailable  availability status (true = available)
     * @return ApiResponse with confirmation message
     * @throws CustomException if the driver is not found
     */
    @Override
    public ApiResponse<String> setDriverAvailability(Long driverId, boolean isAvailable) throws CustomException {
        log.info("Setting availability for driver ID: {} to {}", driverId, isAvailable);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for availability update", driverId);
                    return new NotFoundException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        driver.setIsAvailable(isAvailable);
        deliveryDriverRepository.save(driver);

        log.debug("Driver {} availability set to {}", driverId, isAvailable);
        return ApiResponse.successResponse("Driver availability updated", null);
    }

    /**
     * Fetch all available drivers.
     *
     * @return ApiResponse containing a list of available DriverResponse
     * @throws CustomException if no drivers are available
     */
    @Override
    public ApiResponse<List<DriverResponse>> getAvailableDrivers() throws CustomException {
        log.info("Fetching available drivers");
        List<DriverResponse> availableDrivers = deliveryDriverRepository.findByIsAvailable(true)
                .stream()
                .map(this::mapToDriverResponse)
                .toList();

        if (availableDrivers.isEmpty()) {
            throw new NoContentException(ExceptionCode.NO_AVAILABLE_DRIVERS);
        }

        log.debug("Available drivers found: {}", availableDrivers.size());
        return ApiResponse.successResponse("Available drivers fetched", availableDrivers);
    }

    /**
     * Helper method to convert a DeliveryPerson entity to a DriverResponse DTO.
     *
     * @param driver the DeliveryPerson entity
     * @return DriverResponse DTO
     */
    private DriverResponse mapToDriverResponse(DeliveryPerson driver) {
        return DriverResponse.builder()
                .driverID((long) driver.getId())
                .firstName(driver.getFirstName())
                .lastName(driver.getLastName())
                .email(driver.getEmail())
                .username(driver.getUsername())
                .roles(List.of("DELIVERY_PERSON"))
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .licenseNumber(driver.getLicenseNumber())
                .vehicleNumber(driver.getVehicleNumber())
                .vehicleType(String.valueOf(driver.getVehicleType()))
                .isAvailable(driver.getIsAvailable())
                .currentLat(driver.getCurrentLat())
                .currentLng(driver.getCurrentLng())
                .build();
    }
}

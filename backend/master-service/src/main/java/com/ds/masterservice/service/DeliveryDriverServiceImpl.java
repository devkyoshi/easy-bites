package com.ds.masterservice.service;

import com.ds.commons.enums.VehicleType;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.DeliveryPerson;
import com.ds.masterservice.dto.request.DriverRegistrationRequest;
import com.ds.masterservice.dto.response.DriverResponse;
import com.ds.masterservice.repository.DeliveryDriverRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Service
public class DeliveryDriverServiceImpl implements DeliveryDriverService {
    private final DeliveryDriverRepository deliveryDriverRepository;

    @Autowired
    public DeliveryDriverServiceImpl(DeliveryDriverRepository deliveryDriverRepository) {
        this.deliveryDriverRepository = deliveryDriverRepository;
    }

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

    @Override
    public ApiResponse<DriverResponse> updateDriver(Long driverId, DriverRegistrationRequest updateDTO) throws CustomException {
        log.info("Updating driver with ID: {}", driverId);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found", driverId);
                    return new CustomException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        try {
            VehicleType vehicleType = updateDTO.getVehicleType();
            driver.setVehicleType(vehicleType);
        } catch (IllegalArgumentException e) {
            log.error("Invalid vehicle type: {}", updateDTO.getVehicleType());
            throw new CustomException(ExceptionCode.INVALID_VEHICLE_TYPE);
        }

        if (deliveryDriverRepository.existsByLicenseNumber(updateDTO.getLicenseNumber())) {
            log.warn("License number {} already exists", updateDTO.getLicenseNumber());
            throw new CustomException(ExceptionCode.LICENSE_ALREADY_EXISTS);
        }

        if (deliveryDriverRepository.existsByVehicleNumber(updateDTO.getVehicleNumber())) {
            log.warn("Vehicle number {} already exists", updateDTO.getVehicleNumber());
            throw new CustomException(ExceptionCode.VEHICLE_NUMBER_ALREADY_EXISTS);
        }

        driver.setLicenseNumber(updateDTO.getLicenseNumber());
        driver.setVehicleNumber(updateDTO.getVehicleNumber());

        DeliveryPerson updated = deliveryDriverRepository.save(driver);
        log.info("Driver with ID {} updated successfully", driverId);
        return ApiResponse.successResponse("Driver updated successfully", mapToDriverResponse(updated));
    }

    @Override
    public ApiResponse<String> deleteDriver(Long driverId) throws CustomException {
        log.info("Deleting driver with ID: {}", driverId);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for deletion", driverId);
                    return new CustomException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        deliveryDriverRepository.delete(driver);
        log.info("Driver with ID {} deleted", driverId);
        return ApiResponse.successResponse("Driver deleted successfully", null);
    }

    @Override
    public ApiResponse<String> updateLocation(Long driverId, BigDecimal lat, BigDecimal lng) throws CustomException {
        log.info("Updating location for driver ID: {}", driverId);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for location update", driverId);
                    return new CustomException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        driver.setCurrentLat(lat);
        driver.setCurrentLng(lng);
        deliveryDriverRepository.save(driver);

        log.debug("Driver {} location updated to lat: {}, lng: {}", driverId, lat, lng);
        return ApiResponse.successResponse("Driver location updated successfully", null);
    }

    @Override
    public ApiResponse<String> setDriverAvailability(Long driverId, boolean isAvailable) throws CustomException {
        log.info("Setting availability for driver ID: {} to {}", driverId, isAvailable);
        DeliveryPerson driver = deliveryDriverRepository.findById(driverId)
                .orElseThrow(() -> {
                    log.warn("Driver with ID {} not found for availability update", driverId);
                    return new CustomException(ExceptionCode.DRIVER_NOT_FOUND);
                });

        driver.setIsAvailable(isAvailable);
        deliveryDriverRepository.save(driver);

        log.debug("Driver {} availability set to {}", driverId, isAvailable);
        return ApiResponse.successResponse("Driver availability updated", null);
    }

    @Override
    public ApiResponse<List<DriverResponse>> getAvailableDrivers() throws CustomException {
        log.info("Fetching available drivers");
        List<DriverResponse> availableDrivers = deliveryDriverRepository.findByAvailable(true)
                .stream()
                .map(this::mapToDriverResponse)
                .toList();
        log.debug("Available drivers found: {}", availableDrivers.size());
        return ApiResponse.successResponse("Available drivers fetched", availableDrivers);
    }

    private DriverResponse mapToDriverResponse(DeliveryPerson driver) {
        return DriverResponse.builder()
                .firstName(driver.getFirstName())
                .lastName(driver.getLastName())
                .email(driver.getEmail())
                .username(driver.getUsername())
                .roles(List.of("DELIVERY_PERSON"))
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .vehicleNumber(driver.getVehicleNumber())
                .vehicleType(String.valueOf(driver.getVehicleType()))
                .isAvailable(driver.getIsAvailable())
                .build();
    }
}

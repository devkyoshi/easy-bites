package com.ds.masterservice.repository.deliveryService;

import com.ds.masterservice.dao.deliveryService.DeliveryPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryDriverRepository extends JpaRepository<DeliveryPerson, Long> {
    List<DeliveryPerson> findByIsAvailable(Boolean isAvailable);
    boolean existsByLicenseNumber(String licenseNumber);
    boolean existsByVehicleNumber(String vehicleNumber);
}

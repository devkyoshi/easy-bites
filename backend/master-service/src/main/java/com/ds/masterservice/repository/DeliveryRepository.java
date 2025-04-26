package com.ds.masterservice.repository;

import com.ds.commons.enums.DeliveryStatus;
import com.ds.masterservice.dao.Deliveries;
import com.ds.masterservice.dao.DeliveryPerson;
import com.ds.masterservice.dao.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Deliveries, Long> {
    List<Deliveries> findByDriverAndStatus(DeliveryPerson driver, DeliveryStatus status);
    boolean existsByOrderAndStatusIn(Order order, List<DeliveryStatus> statuses);
}

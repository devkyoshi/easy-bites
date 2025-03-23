package com.ds.authservice.repositories;

import com.ds.authservice.models.DeliveryPersonnel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryPersonnelRepository extends JpaRepository<DeliveryPersonnel,Long> {
}

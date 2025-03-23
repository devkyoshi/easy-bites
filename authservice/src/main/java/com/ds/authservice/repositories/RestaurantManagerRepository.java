package com.ds.authservice.repositories;

import com.ds.authservice.models.RestaurantManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantManagerRepository extends JpaRepository<RestaurantManager, Long> {
}

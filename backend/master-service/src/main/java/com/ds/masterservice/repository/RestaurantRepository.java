package com.ds.masterservice.repository;

import com.ds.masterservice.dao.restaurantService.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    boolean existsByName(String name);
    List<Restaurant> findByManagerId(Integer managerId);
}

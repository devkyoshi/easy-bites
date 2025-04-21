package com.ds.masterservice.repository;

import com.ds.masterservice.dao.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByCategoryId(Long categoryId);
    List<FoodItem> findByRestaurantId(Long restaurantId);

    Boolean existsByNameAndCategoryId(String name, Long categoryId);
}

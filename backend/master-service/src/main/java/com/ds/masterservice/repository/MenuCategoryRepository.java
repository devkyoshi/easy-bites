package com.ds.masterservice.repository;

import com.ds.masterservice.dao.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {

    Boolean existsMenuCategoryByNameAndRestaurantIdAndIsDisabledFalse( String name, Long restaurantId);
}

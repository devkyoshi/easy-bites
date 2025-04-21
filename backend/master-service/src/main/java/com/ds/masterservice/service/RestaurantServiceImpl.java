package com.ds.masterservice.service;

import com.ds.commons.enums.DayOfWeek;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.FoodItem;
import com.ds.masterservice.dao.MenuCategory;
import com.ds.masterservice.dao.Restaurant;
import com.ds.masterservice.dao.RestaurantManager;
import com.ds.masterservice.dto.request.FoodItemRequest;
import com.ds.masterservice.dto.request.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.response.FoodItemResponse;
import com.ds.masterservice.dto.response.MenuCategoryResponse;
import com.ds.masterservice.dto.response.RestaurantInitResponse;
import com.ds.masterservice.repository.FoodItemRepository;
import com.ds.masterservice.repository.MenuCategoryRepository;
import com.ds.masterservice.repository.RestaurantRepository;
import jdk.jfr.Category;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class RestaurantServiceImpl implements RestaurantService {

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuCategoryRepository menuCategoryRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public Restaurant getRestaurant() {
        return null;
    }

    @Override
    public ApiResponse<RestaurantInitResponse> createRestaurant(RestaurantCreateUpdateRequest request) throws CustomException {

        try{
            //Check if required fields are present
            if(request.getName() == null || request.getName().isEmpty() || request.getManagerId() == null || request.getManagerId() == 0){
                log.error("Create Restaurant Request Failed: Required fields are missing");
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }

            if (isRestaurantExists(request.getName())) {
                log.error("Restaurant with name {} already exists", request.getName());
                throw new CustomException(ExceptionCode.RESTAURANT_ALREADY_EXISTS);
            }

            RestaurantManager restaurantManager =  userService.getRestaurantManagerByUserId(request.getManagerId());

            Restaurant restaurant = Restaurant.builder()
                    .name(request.getName())
                    .description(request.getDescription() != null ? request.getDescription() : "")
                    .address(request.getAddress() != null ? request.getAddress() : "")
                    .phone(request.getPhone() != null ? request.getPhone() : "")
                    .email(request.getEmail() != null ? request.getEmail() : "")
                    .logoUrl(request.getLogoUrl() != null ? request.getLogoUrl() : "")
                    .openingHour(request.getOpeningHour() != null ? request.getOpeningHour() : "00:00")
                    .closingHour(request.getClosingHour() != null ? request.getClosingHour() : "00:00")
                    .daysOpen(request.getDaysOpen() != null ?
                            request.getDaysOpen().stream()
                                    .map(DayOfWeek::valueOf)
                                    .toList() : List.of())
                    .isOpen(request.getIsOpen() != null ? request.getIsOpen() : false)
                    .manager(restaurantManager)
                    .build();

            restaurant = restaurantRepository.save(restaurant);

            RestaurantInitResponse response = new RestaurantInitResponse(restaurant);
            return ApiResponse.createdSuccessResponse(" Restaurant created successfully", response);
        }catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while fetching the restaurant manager: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }

    }

    @Override
    public ApiResponse<MenuCategoryResponse> addMenuCategory(Long restaurantId, MenuCategoryCreateRequest request) throws CustomException {

        try {
            // Check if required fields are present
            if (request.getName() == null || request.getName().isEmpty()) {
                log.error("Add Menu Category Request Failed: Required fields are missing");
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }

            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND));

            if (restaurant.getMenuCategories().stream().anyMatch(category -> category.getName().equalsIgnoreCase(request.getName()))) {
                log.error("Menu category with name {} already exists", request.getName());
                throw new CustomException(ExceptionCode.MENU_CATEGORY_ALREADY_EXISTS);
            }

            // Create and save the new menu category
            MenuCategory menuCategory = new MenuCategory();

            menuCategory.setName(request.getName());
            menuCategory.setRestaurant(restaurant);

            restaurant.getMenuCategories().add(menuCategory);
            restaurantRepository.save(restaurant);

            // Create the response object
            MenuCategoryResponse menuCategoryResponse = new MenuCategoryResponse();
            menuCategoryResponse.setCategoryId(menuCategory.getId());
            menuCategoryResponse.setName(request.getName());
            menuCategoryResponse.setRestaurantId(restaurantId);

            return ApiResponse.createdSuccessResponse("Menu category added successfully", menuCategoryResponse);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while adding the menu category: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    public ApiResponse<FoodItemResponse> addFoodItems(Long restaurantId, FoodItemRequest request) throws CustomException {
        try{

            // Check if required fields are present
            if (request.getName() == null || request.getName().isEmpty() || request.getCategoryId() == null || request.getCategoryId() == 0) {
                log.error("Add Food Item Request Failed: Required fields are missing");
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }

            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND));


            // Check if the menu category exists
            MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new CustomException(ExceptionCode.MENU_CATEGORY_NOT_FOUND));

            // Check if the food item already exists
            if (foodItemRepository.existsByNameAndCategoryId(request.getName(), request.getCategoryId())) {
                log.error("Food item with name {} already exists in category {}", request.getName(), request.getCategoryId());
                throw new CustomException(ExceptionCode.FOOD_ITEM_ALREADY_EXISTS);
            }

            // Create and save the new food item
            FoodItem foodItem = FoodItem.builder()
                    .name(request.getName())
                    .description(request.getDescription() != null ? request.getDescription() : "")
                    .price(request.getPrice() != null ? request.getPrice() : 0.0)
                    .imageUrl(request.getImageUrl() != null ? request.getImageUrl() : "")
                    .stockQuantityPerDay(request.getStockQuantityPerDay() != null ? request.getStockQuantityPerDay() : 0)
                    .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : false)
                    .category(category)
                    .restaurant(restaurant)
                    .build();

            FoodItem item = foodItemRepository.save(foodItem);

            // Create the response object
            FoodItemResponse foodItemResponse = new FoodItemResponse(item);

            return ApiResponse.createdSuccessResponse("Food item added successfully", foodItemResponse);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while adding a food item: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }

    }

    public boolean isRestaurantExists(String name) {
        return restaurantRepository.existsByName(name);
    }
}

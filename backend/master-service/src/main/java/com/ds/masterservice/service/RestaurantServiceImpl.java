package com.ds.masterservice.service;

import com.ds.commons.enums.DayOfWeek;
import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.dao.authService.User;
import com.ds.masterservice.dao.orderService.Order;
import com.ds.masterservice.dao.orderService.OrderItem;
import com.ds.masterservice.dao.restaurantService.FoodItem;
import com.ds.masterservice.dao.restaurantService.MenuCategory;
import com.ds.masterservice.dao.restaurantService.Restaurant;
import com.ds.masterservice.dao.restaurantService.RestaurantManager;
import com.ds.masterservice.dto.request.food.FoodItemRequest;
import com.ds.masterservice.dto.request.menu.MenuCategoryCreateRequest;
import com.ds.masterservice.dto.request.restaurant.RestaurantCreateUpdateRequest;
import com.ds.masterservice.dto.response.OrderItemResponse;
import com.ds.masterservice.dto.response.food.FoodItemInitResponse;
import com.ds.masterservice.dto.response.food.FoodItemResponse;
import com.ds.masterservice.dto.response.menu.MenuCategoryInitResponse;
import com.ds.masterservice.dto.response.menu.MenuCategoryResponse;
import com.ds.masterservice.dto.response.restaurant.OrderReqResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantAdminResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantInitResponse;
import com.ds.masterservice.dto.response.restaurant.RestaurantResponse;
import com.ds.masterservice.repository.FoodItemRepository;
import com.ds.masterservice.repository.MenuCategoryRepository;
import com.ds.masterservice.repository.RestaurantRepository;
import com.ds.masterservice.repository.UserRepository;
import com.ds.masterservice.repository.orderService.OrderItemRepository;
import com.ds.masterservice.repository.orderService.OrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class RestaurantServiceImpl implements RestaurantService {


    private final UserService userService;
    private final RestaurantRepository restaurantRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final FoodItemRepository foodItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    @Autowired
    public RestaurantServiceImpl(UserService userService, RestaurantRepository restaurantRepository, MenuCategoryRepository menuCategoryRepository, FoodItemRepository foodItemRepository, OrderRepository orderRepository, UserRepository userRepository, OrderItemRepository orderItemRepository) {
        this.userService = userService;
        this.restaurantRepository = restaurantRepository;
        this.menuCategoryRepository = menuCategoryRepository;
        this.foodItemRepository = foodItemRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }


    @Override
    public ApiResponse<RestaurantResponse> getRestaurant(Long restaurantId) throws CustomException {

        try {
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND));

            RestaurantResponse response = new RestaurantResponse();

            response.setRestaurantId(restaurant.getId());
            response.setName(restaurant.getName());
            response.setDescription(restaurant.getDescription());
            response.setAddress(restaurant.getAddress());
            response.setPhone(restaurant.getPhone());
            response.setEmail(restaurant.getEmail());
            response.setLogoUrl(restaurant.getLogoUrl());
            response.setOpeningHour(restaurant.getOpeningHour());
            response.setClosingHour(restaurant.getClosingHour());
            response.setDaysOpen(restaurant.getDaysOpen().stream()
                    .map(DayOfWeek::name)
                    .toList());
            response.setIsOpen(restaurant.getIsOpen());


            List<FoodItemInitResponse> foodItemResponses =  restaurant.getMenuCategories().stream()
                    .flatMap(category -> category.getFoodItems().stream())
                    .filter(foodItem -> !foodItem.getIsDisabled())
                    .map(FoodItemInitResponse::new)
                    .toList();

            response.setFoodItems(foodItemResponses);

            List<MenuCategoryInitResponse> menuCategories = restaurant.getMenuCategories().stream()
                    .filter(category -> !category.getIsDisabled())
                    .map(MenuCategoryInitResponse::new)
                    .toList();

            response.setMenuCategories(menuCategories);
            return ApiResponse.successResponse("Restaurant fetched successfully", response);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while fetching the restaurant: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
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

              Optional<MenuCategory> existingCategory = restaurant.getMenuCategories().stream()
                      .filter(category -> category.getName().equalsIgnoreCase(request.getName()))
                      .findFirst();

              if (existingCategory.isPresent()) {
                  MenuCategory category = existingCategory.get();
                  if (category.getIsDisabled()) {
                      category.setIsDisabled(false);
                      menuCategoryRepository.save(category);
                        log.info("Menu category with name {} is reactivated", request.getName());
                        MenuCategoryResponse menuCategoryResponse = new MenuCategoryResponse();
                        menuCategoryResponse.setCategoryId(category.getId());
                        menuCategoryResponse.setName(request.getName());
                        menuCategoryResponse.setRestaurantId(restaurantId);
                        return ApiResponse.successResponse("Menu category reactivated successfully", menuCategoryResponse);
                  } else {
                      log.error("Menu category with name {} already exists", request.getName());
                      throw new CustomException(ExceptionCode.MENU_CATEGORY_ALREADY_EXISTS);
                  }
              }

            // Create and save the new menu category
            MenuCategory menuCategory = new MenuCategory();

            menuCategory.setName(request.getName());
            menuCategory.setRestaurant(restaurant);
            menuCategory.setIsDisabled(false);

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
            if (isFoodItemExists(request.getName(), request.getCategoryId())) {
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
                    .isDisabled(false)
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

    @Override
    public ApiResponse<List<MenuCategoryResponse>> getMenuCategories(Long restaurantId) throws CustomException {

        try {
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND));

        List<MenuCategoryResponse> menuCategories = restaurant.getMenuCategories().stream()
            .filter(category -> !category.getIsDisabled())
            .map(MenuCategoryResponse::new)
            .toList();

            return ApiResponse.successResponse("Menu categories fetched successfully", menuCategories);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while fetching the menu categories: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    public ApiResponse<List<FoodItemResponse>> getFoodItems(Long restaurantId) throws CustomException {

        try {
            Restaurant restaurant = restaurantRepository.findById(restaurantId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND));

           List<FoodItem> foodItems = restaurant.getMenuCategories().stream()
             .filter(category -> !category.getIsDisabled())
             .flatMap(category -> category.getFoodItems().stream())
             .filter(foodItem -> !foodItem.getIsDisabled())
             .toList();

           List<FoodItemResponse> foodItemResponses = foodItems.stream()
                   .map(FoodItemResponse::new)
                   .toList();

            return ApiResponse.successResponse("Food items fetched successfully", foodItemResponses);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while fetching the food items: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    public ApiResponse<List<RestaurantInitResponse>> getAllRestaurants() throws CustomException {
        try {
            List<Restaurant> restaurants = restaurantRepository.findAll();

            List<RestaurantInitResponse> restaurantResponses = restaurants.stream()
                    .map(RestaurantInitResponse::new)
                    .toList();

            return ApiResponse.successResponse("Restaurants fetched successfully", restaurantResponses);
        } catch (Exception e) {
                log.error("An error occurred while fetching all restaurants: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ApiResponse<RestaurantAdminResponse> getAdminRestaurantData(Integer adminId) throws CustomException {
       try{

              RestaurantManager restaurantManager = userService.getRestaurantManagerByUserId(adminId);

                if (restaurantManager == null) {
                    log.error("Restaurant manager with ID {} not found", adminId);
                    throw new CustomException(ExceptionCode.RESTAURANT_MANAGER_NOT_FOUND);
                }

                List<Restaurant> restaurants = restaurantRepository.findByManagerId(adminId);

                //get the first restaurant
                Restaurant restaurant = restaurants.isEmpty() ? null : restaurants.getFirst();

                RestaurantAdminResponse restaurantAdminResponse = RestaurantAdminResponse.builder()
                        .restaurantId(restaurant != null ? restaurant.getId() : null)
                        .restaurantName(restaurant != null ? restaurant.getName() : null)
                        .restaurantAddress(restaurant != null ? restaurant.getDescription() : null)
                        .address(restaurant != null ? restaurant.getAddress() : null)
                        .phone(restaurant != null ? restaurant.getPhone() : null)
                        .email(restaurant != null ? restaurant.getEmail() : null)
                        .logo(restaurant != null ? restaurant.getLogoUrl() : null)
                        .openingHour(restaurant != null ? restaurant.getOpeningHour() : null)
                        .closingHour(restaurant != null ? restaurant.getClosingHour() : null)
                        .description(restaurant != null ? restaurant.getDescription() : null)
                        .daysOpen(restaurant != null ? restaurant.getDaysOpen().stream()
                                .map(DayOfWeek::name)
                                .toList() : List.of())
                        .isOpen(restaurant != null && restaurant.getIsOpen())
                      .foodItems(restaurant != null ? restaurant.getMenuCategories().stream()
                               .filter(category -> !category.getIsDisabled())
                               .flatMap(category -> category.getFoodItems().stream())
                               .filter(foodItem -> !foodItem.getIsDisabled())
                               .map(FoodItemResponse::new)
                               .toList() : List.of())
                      .menuCategories(restaurant != null ? restaurant.getMenuCategories().stream()
                              .filter(category -> !category.getIsDisabled())
                              .map(MenuCategoryInitResponse::new)
                              .toList() : List.of())
                         .build();


           return ApiResponse.successResponse("Admin restaurant data fetched successfully", restaurantAdminResponse);
       } catch (Exception e) {
           if (e instanceof CustomException) {
               log.error("An custom error occurred while fetching the admin restaurant: {}", e.getMessage());
               throw (CustomException) e;
           } else {
               log.error("An error occurred while fetching the admin restaurant: {}", e.getMessage());
               throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
           }
       }
    }

    @Override
    public ApiResponse<FoodItemResponse> updateFoodItem(Long restaurantId, Long foodItemId, FoodItemRequest request) throws CustomException {
        try {
            // Check if required fields are present
            if (request.getName() == null || request.getName().isEmpty()) {
                log.error("Update Food Item Request Failed: Required fields are missing");
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }


            if(!isRestaurantExistById(restaurantId)){
                log.error("Restaurant with ID {} not found", restaurantId);
                throw new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND);
            }

            FoodItem foodItem = foodItemRepository.findById(foodItemId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.FOOD_ITEM_NOT_FOUND));

            // Update the food item details
            if(request.getName() != null) {
                foodItem.setName(request.getName());
            }
            if(request.getDescription() != null) {
                foodItem.setDescription(request.getDescription());
            }
            if(request.getPrice() != null) {
                foodItem.setPrice(request.getPrice());
            }

            if(request.getImageUrl() != null) {
                foodItem.setImageUrl(request.getImageUrl());
            }
            if(request.getStockQuantityPerDay() != null) {
                foodItem.setStockQuantityPerDay(request.getStockQuantityPerDay());
            }
            if(request.getIsAvailable() != null) {
                foodItem.setIsAvailable(request.getIsAvailable());
            }
            if(request.getCategoryId() != null) {
                MenuCategory category = menuCategoryRepository.findById(request.getCategoryId())
                        .orElseThrow(() -> new CustomException(ExceptionCode.MENU_CATEGORY_NOT_FOUND));
                foodItem.setCategory(category);
            }

            foodItem = foodItemRepository.save(foodItem);

            FoodItemResponse foodItemResponse = new FoodItemResponse(foodItem);

            return ApiResponse.successResponse("Food item updated successfully", foodItemResponse);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while updating the food item: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    public ApiResponse<Void> deleteFoodItem(Long restaurantId, Long foodItemId) throws CustomException {
        try {
            if(!isRestaurantExistById(restaurantId)){
                log.error("Restaurant {} not found", restaurantId);
                throw new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND);
            }

            FoodItem foodItem = foodItemRepository.findById(foodItemId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.FOOD_ITEM_NOT_FOUND));


            foodItem.setIsDisabled(true);
            foodItemRepository.save(foodItem);

            return ApiResponse.successResponse("Food item deleted successfully", null);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while deleting the food item: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    public ApiResponse<MenuCategoryResponse> updateMenuCategory(Long restaurantId, Long menuCategoryId, MenuCategoryCreateRequest request) throws CustomException {
        try {
            // Check if required fields are present
            if (request.getName() == null || request.getName().isEmpty()) {
                log.error("Update Menu Category Request Failed: Required fields are missing");
                throw new CustomException(ExceptionCode.MISSING_REQUIRED_FIELDS);
            }

            if(!isRestaurantExistById(restaurantId)){
                log.error("Restaurant with ID {} not found", restaurantId);
                throw new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND);
            }

            MenuCategory menuCategory = menuCategoryRepository.findById(menuCategoryId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.MENU_CATEGORY_NOT_FOUND));

            // Update the menu category details
            menuCategory.setName(request.getName());

            menuCategory = menuCategoryRepository.save(menuCategory);

            MenuCategoryResponse menuCategoryResponse = new MenuCategoryResponse(menuCategory);

            return ApiResponse.successResponse("Menu category updated successfully", menuCategoryResponse);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while updating the menu category: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    public ApiResponse<Void> deleteMenuCategory(Long restaurantId, Long menuCategoryId) throws CustomException {
        try {
            if(!isRestaurantExistById(restaurantId)){
                log.error("Restaurant {} not found", restaurantId);
                throw new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND);
            }

            MenuCategory menuCategory = menuCategoryRepository.findById(menuCategoryId)
                    .orElseThrow(() -> new CustomException(ExceptionCode.MENU_CATEGORY_NOT_FOUND));


            menuCategory.setIsDisabled(true);
            menuCategoryRepository.save(menuCategory);

            return ApiResponse.successResponse("Menu category deleted successfully", null);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while deleting the menu category: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    public ApiResponse<List<OrderReqResponse>> getOrdersByRestaurantId(Long restaurantId) throws CustomException {

        try {
            if(!isRestaurantExistById(restaurantId)){
                log.error("Restaurant with ID:  {} not found", restaurantId);
                throw new CustomException(ExceptionCode.RESTAURANT_NOT_FOUND);
            }

            List<OrderItem> orders = orderItemRepository.findByRestaurantId(restaurantId);

            if (orders.isEmpty()) {
                log.info("No orders found for restaurant with ID {}", restaurantId);
                return ApiResponse.successResponse("No orders found for the restaurant", List.of());
            }


            List<OrderReqResponse> orderResponses = orders.stream()
                    .map(orderItem -> {
                        Order order = null;
                        try {
                            order = orderRepository.findById(orderItem.getOrderId())
                                    .orElseThrow(() -> new CustomException(ExceptionCode.ORDER_NOT_FOUND));
                        } catch (CustomException e) {
                            throw new RuntimeException(e);
                        }
                        User customer;
                        try {
                            customer = userRepository.findById(Math.toIntExact(order.getUserId()))
                                    .orElseThrow(() -> new CustomException(ExceptionCode.USER_NOT_FOUND));
                        } catch (CustomException e) {
                            throw new RuntimeException(e);
                        }

                        return OrderReqResponse.builder()
                                .orderId(order.getId())
                                .orderItems(order.getItems().stream()
                                        .map(item -> new OrderItemResponse(item.getItemId(), item.getQuantity(), item.getUnitPrice(), item.getTotalPrice(), item.getItemName(), item.getItemImage()))
                                        .toList())
                                .orderStatus(order.getStatus().name())
                                .paymentStatus(order.getPaymentStatus().name())
                                .orderDate(order.getCreatedAt().toString())
                                .deliveryAddress(order.getDeliveryAddress())
                                .totalAmount(order.getTotalAmount())
                                .customerName(customer.getFirstName() + " " + customer.getLastName())
                                .customerPhone(customer.getPhone())
                                .build();
                    })
                    .toList();

            return ApiResponse.successResponse("Orders fetched successfully", orderResponses);
        } catch (Exception e) {
            if (e instanceof CustomException) {
                throw (CustomException) e;
            } else {
                log.error("An error occurred while fetching the orders: {}", e.getMessage());
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }
        }

    }

    public boolean isRestaurantExists(String name) {
        return restaurantRepository.existsByName(name);
    }

    //ignore the warning
    public boolean isRestaurantExistById(Long id) {
        return restaurantRepository.existsById(id);
    }

    public boolean isFoodItemExists( String name, Long categoryId) {
        return foodItemRepository.existsByNameAndCategoryIdAndIsDisabledFalse( name, categoryId);
    }

    public boolean isMenuCategoryExists(String name, Long restaurantId) {
        return menuCategoryRepository.existsMenuCategoryByNameAndRestaurantIdAndIsDisabledFalse(name, restaurantId);
    }

}

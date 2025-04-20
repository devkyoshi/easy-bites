package com.ds.masterservice;

import com.ds.masterservice.dao.Restaurant;
import com.ds.masterservice.service.RestaurantService;
import com.ds.masterservice.service.RoleService;
import com.ds.masterservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MasterServiceImpl implements MasterService {

    private final UserService userService;
    private final RoleService roleService;
    private final RestaurantService restaurantService;

    @Autowired
    public MasterServiceImpl(UserService userService, RoleService roleService, RestaurantService restaurantService) {
        this.userService = userService;
        this.roleService = roleService;
        this.restaurantService = restaurantService;
    }

    @Override
    public UserService getUserService() {
        return userService;
    }

    @Override
    public RoleService getRoleService() {
        return roleService;
    }

    @Override
    public Restaurant getRestaurant() {
        return restaurantService.getRestaurant();
    }
}

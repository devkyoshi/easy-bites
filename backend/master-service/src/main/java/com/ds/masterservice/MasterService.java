package com.ds.masterservice;

import com.ds.masterservice.dao.Restaurant;
import com.ds.masterservice.service.RoleService;
import com.ds.masterservice.service.UserService;

public interface MasterService {
    UserService getUserService();
    RoleService getRoleService();


    //Restaurant Service Methods

    Restaurant getRestaurant();

}

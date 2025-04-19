package com.ds.masterservice;

import com.ds.masterservice.service.RoleService;
import com.ds.masterservice.service.UserService;

public interface MasterService {
    UserService getUserService();
    RoleService getRoleService();

}

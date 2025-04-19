package com.ds.masterservice;

import com.ds.masterservice.service.RoleService;
import com.ds.masterservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MasterServiceImpl implements MasterService {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public MasterServiceImpl(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @Override
    public UserService getUserService() {
        return userService;
    }

    @Override
    public RoleService getRoleService() {
        return roleService;
    }
}

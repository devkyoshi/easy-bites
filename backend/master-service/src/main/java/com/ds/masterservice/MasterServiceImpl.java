package com.ds.masterservice;

import com.ds.masterservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MasterServiceImpl implements MasterService {

    private final UserService userService;

    @Autowired
    public MasterServiceImpl(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserService getUserService() {
        return userService;
    }
}

package com.ds.masterservice;

import com.ds.masterservice.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class MasterServiceImpl implements MasterService {
    private UserService userService;
}

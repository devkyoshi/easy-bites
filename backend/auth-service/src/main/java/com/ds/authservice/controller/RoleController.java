package com.ds.authservice.controller;

import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.MasterService;
import com.ds.masterservice.dao.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final MasterService masterService;

    @Autowired
    public RoleController(MasterService masterService) {
        this.masterService = masterService;
    }

    @PostMapping("/add")
    public ApiResponse<Role> addRole(@RequestParam String name, @RequestBody List<String> authorities) {
        Role role = masterService.getRoleService().createRole(name, authorities);
        return ApiResponse.successResponse("Role created", role);
    }

    @GetMapping("/all")
    public ApiResponse<List<Role>> getRoles() {
        return ApiResponse.successResponse(masterService.getRoleService().getAllRoles());
    }
}

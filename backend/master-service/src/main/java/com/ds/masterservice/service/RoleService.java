package com.ds.masterservice.service;

import com.ds.masterservice.dao.Role;

import java.util.List;

public interface RoleService {
    Role createRole(String name, List<String> authorities);
    List<Role> getAllRoles();
}

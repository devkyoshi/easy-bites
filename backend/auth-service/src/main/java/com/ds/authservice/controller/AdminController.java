package com.ds.authservice.controller;

import com.ds.authservice.dto.UserResponseDTO;
import com.ds.commons.template.ApiResponse;
import com.ds.masterservice.MasterService;
import com.ds.masterservice.dao.authService.Role;
import com.ds.masterservice.dao.authService.StaffRegistration;
import com.ds.masterservice.dao.authService.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private MasterService masterService;

    @GetMapping("/users")
    public ApiResponse<List<UserResponseDTO>> getAllUsers() {

        log.info("Fetching all users...");
        List<User> users = masterService.getUserService().getAllUsers();
        List<UserResponseDTO> userDTOs = users.stream()
                .map(user -> {
                    String role = user.getRoles().stream()
                            .map(Role::getName)
                            .findFirst()
                            .orElse("UNKNOWN");

                    return new UserResponseDTO(
                            user.getUsername(),
                            user.getEmail(),
                            user.getFirstName(),
                            user.getLastName(),
                            user.getId(),
                            role,
                            true, // Assuming all users are enabled
                            user.getPhone()
                    );
                })
                .collect(Collectors.toList());

        return ApiResponse.successResponse("Users fetched successfully", userDTOs);
    }

    @GetMapping("/staff-registrations")
    public ApiResponse<List<StaffRegistration>> getAllStaffRegistrations() {
        List<StaffRegistration> staffRegistrations = masterService.getUserService().getAllStaffRegistrations();
        return ApiResponse.successResponse("Staff registrations fetched successfully", staffRegistrations);
    }

    @PutMapping("/approve-staff/{id}")
    public ApiResponse<Boolean> approveStaffRegistration(@PathVariable("id") Long id) {
        boolean result = masterService.getUserService().approveStaffRegistration(id);
        return ApiResponse.successResponse("Staff registration approved successfully", result);
    }

    @PutMapping("/reject-staff/{id}")
    public ApiResponse<Boolean> rejectStaffRegistration(@PathVariable("id") Long id) {
        boolean result = masterService.getUserService().rejectStaffRegistration(id);
        return ApiResponse.successResponse("Staff registration rejected successfully", result);
    }
}

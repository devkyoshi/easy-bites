package com.ds.authservice;

import com.ds.masterservice.dao.authService.Role;
import com.ds.masterservice.dao.authService.SystemAdmin;
import com.ds.masterservice.dao.authService.User;
import com.ds.masterservice.repository.RoleRepository;
import com.ds.masterservice.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Slf4j
@SpringBootApplication
@ComponentScan(basePackages = {"com.ds.authservice", "com.ds.commons",  "com.ds.masterservice"})
@EnableJpaRepositories(basePackages = "com.ds.masterservice.repository")
@EntityScan(basePackages = "com.ds.masterservice.dao")
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepo) {

        log.info("Initializing roles...");
        return args -> {
            insertRoleIfNotExists(roleRepo, "ROLE_CUSTOMER", List.of("ORDER_CREATE", "ORDER_VIEW"));
            insertRoleIfNotExists(roleRepo, "ROLE_RESTAURANT_MANAGER", List.of("MENU_MANAGE"));
            insertRoleIfNotExists(roleRepo, "ROLE_DELIVERY_PERSON", List.of("ORDER_DELIVER"));
            insertRoleIfNotExists(roleRepo, "ROLE_SYSTEM_ADMIN", List.of("USER_MANAGE", "ROLE_MANAGE"));
        };
    }

    private void insertRoleIfNotExists(RoleRepository repo, String roleName, List<String> authorities) {
        if (repo.findByName(roleName).isEmpty()) {
            repo.save(new Role(0, roleName, authorities));
            log.info("Role {} created with authorities {}", roleName, authorities);
        }
    }

    @Bean
    CommandLineRunner initSystemAdmin(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        log.info("Checking if system admin exists...");
        return args -> {
            if (userRepository.findUserByUsername("admin").isEmpty()) {
                log.info("Creating system admin user...");

                // Get the SYSTEM_ADMIN role
                Role adminRole = roleRepository.findByName("ROLE_SYSTEM_ADMIN")
                        .orElseThrow(() -> new RuntimeException("ROLE_SYSTEM_ADMIN not found"));

                // Create the system admin user
                SystemAdmin admin = new SystemAdmin();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin1234"));
                admin.setFirstName("easybite");
                admin.setLastName("admin");
                admin.setEmail("admin@easybite.com");
                admin.setRoles(List.of(adminRole));

                // Save the admin user
                userRepository.save(admin);
                log.info("System admin user created successfully");
            } else {
                log.info("System admin user already exists");
            }
        };
    }

}

package com.ds.authservice;

import com.ds.masterservice.dao.Role;
import com.ds.masterservice.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

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

}

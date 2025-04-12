package com.ds.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.RestController;


@SpringBootApplication
@ComponentScan(basePackages = {"com.ds.apigateway", "com.ds.masterservice"})
@EnableJpaRepositories(basePackages = "com.ds.masterservice.repository")
@EntityScan(basePackages = "com.ds.masterservice.dao")
@RestController
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}



package com.ds.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/auth/**")
                        .uri("http://localhost:8081/"))
                /*.route("master-service", r -> r.path("/api/**")
                        .uri("http://localhost:8082/"))*/
                .route("restaurant-service", r -> r.path("/api/restaurants/**")
                        .uri("http://localhost:8082/"))
                .route("delivery-service", r -> r.path("/api/delivery/**")
                        .uri("http://localhost:8084/"))
                .route("order-service", r -> r.path("/api/order/**")
                        .uri("http://localhost:8083/"))
                .build();
    }
}

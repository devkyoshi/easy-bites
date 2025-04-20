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
                .route("restaurant-service", r -> r.path("/api/restaurant/**")
                        .uri("http://localhost:8082/"))
                .build();
    }
}

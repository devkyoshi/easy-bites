package com.ds.apigateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/auth/**", "/admin/**")
                        .uri("http://localhost:8081/"))
                .route("restaurant-service", r -> r.path("/api/restaurants/**")
                        .uri("http://localhost:8082/"))
                .route("delivery-service", r -> r.path("/api/delivery/**")
                        .uri("http://localhost:8084/"))
                .route("order-service", r -> r.path("/api/order/**")
                        .uri("http://localhost:8083/"))
                .build();
    }

    @Bean
    public GlobalFilter simpleLogFilter() {
        return (exchange, chain) -> {
            System.out.println("Incoming request to: " + exchange.getRequest().getURI());
            return chain.filter(exchange);
        };
    }

    @Bean
    public GlobalFilter corsPreflightLogger() {
        return (exchange, chain) -> {
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequest().getMethod().name())) {
                System.out.println("CORS Preflight Request to: " + exchange.getRequest().getURI());
            }
            return chain.filter(exchange);
        };
    }
}

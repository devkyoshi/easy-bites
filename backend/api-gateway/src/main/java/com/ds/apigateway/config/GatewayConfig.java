package com.ds.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Value("${AUTH_SERVICE_URI:http://localhost:8081}")
    private String authServiceUri;

    @Value("${RESTAURANT_SERVICE_URI:http://localhost:8082}")
    private String restaurantServiceUri;

    @Value("${DELIVERY_SERVICE_URI:http://localhost:8084}")
    private String deliveryServiceUri;

    @Value("${ORDER_SERVICE_URI:http://localhost:8083}")
    private String orderServiceUri;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/auth/**", "/admin/**")
                        .uri(authServiceUri))
                .route("restaurant-service", r -> r.path("/api/restaurants/**")
                        .uri(restaurantServiceUri))
                .route("delivery-service", r -> r.path("/api/delivery/**")
                        .uri(deliveryServiceUri))
                .route("order-service", r -> r.path("/api/order/**")
                        .uri(orderServiceUri))
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

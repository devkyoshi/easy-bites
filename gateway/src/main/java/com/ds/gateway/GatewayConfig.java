package com.ds.gateway;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public GlobalFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }
}

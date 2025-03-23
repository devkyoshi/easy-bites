package com.ds.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, UserAuthenticationFilter userAuthenticationFilter) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                        .requestMatchers("/auth/register/**", "/auth/login/**")
                        .permitAll()
                        .anyRequest()
                        .authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(userAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }


}

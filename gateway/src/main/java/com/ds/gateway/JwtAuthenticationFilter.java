package com.ds.gateway;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;

import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Base64;
import java.util.Map;

@Slf4j
public class JwtAuthenticationFilter implements GlobalFilter {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();

        //Skip JWT validation for login requests and registration requests
        if (path.contains("/auth/login") || path.contains("/auth/register")) {
            log.info( "Skipping JWT validation for path: {}", path);
            return chain.filter(exchange);
        }

        if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
            log.info( "Authorization header not found in request");
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String token = authHeader != null && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

        if (token == null || !validateToken(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        Claims claims = extractClaims(token);
        if(claims == null){
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        try{
            Map<String, Object> userPayload = Map.of(
                    "userId", claims.get("userId"),
                    "username", claims.get("username"),
                    "firstName", claims.get("firstName"),
                    "lastName", claims.get("lastName"),
                    "email", claims.get("email"),
                    "roles", claims.get("roles")
            );

            // Serialize the user data to JSON
            String userJson = objectMapper.writeValueAsString(userPayload);

            // Forward the claims as "user" key in the headers
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-User", userJson)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } catch (Exception e) {
            log.error("Error serializing user data: {}", e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            return exchange.getResponse().setComplete();
        }
    }
    private boolean validateToken(String token) {
        try {
            byte[] decodedKey = Base64.getDecoder().decode(secretKey);

            Jwts.parser().setSigningKey(decodedKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private Claims extractClaims(String token) {
        try {
            byte[] decodedKey = Base64.getDecoder().decode(secretKey);
            return Jwts.parser()
                    .setSigningKey(decodedKey)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return null;
        }
    }


}

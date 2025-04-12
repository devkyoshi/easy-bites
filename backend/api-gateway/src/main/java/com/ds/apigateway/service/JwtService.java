package com.ds.apigateway.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@Slf4j
public class JwtService {
    @Value("${jwt.secret-key}")
    private String SECRET;

    @Value("${jwt.expiration}")
    private Long EXPIRATION;

    public String generateToken(String userName) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userName);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build().parseSignedClaims(token)
                .getPayload();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private String createToken(Map<String, Object> claims, String userName) {
        if (EXPIRATION != null) {
            return Jwts.builder()
                    .claims(claims)
                    .subject(userName)
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                    .signWith(getSigningKey())
                    .compact();
        } else {
            log.error("JWT expiration is null");
            throw new IllegalArgumentException("JWT expiration is null");
        }
    }

    private SecretKey getSigningKey() {
        if (SECRET == null) {
            log.error("JWT secret is null");
            throw new IllegalArgumentException("JWT secret is null");
        }
        byte[] secretBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(secretBytes);
    }
}

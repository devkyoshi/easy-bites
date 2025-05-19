package com.ds.authservice.security;

import com.ds.authservice.service.JwtService;

import com.ds.masterservice.MasterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final MasterService masterService;

    @Autowired
    public JwtAuthFilter(JwtService jwtService,  MasterService masterService) {
        this.jwtService = jwtService;
        this.masterService = masterService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException, ClassCastException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = masterService.getUserService().loadUserByUsername(username);

            if (jwtService.validateToken(token, userDetails)) {
                // Extract role from token
                String role = jwtService.extractRole(token);
                List<SimpleGrantedAuthority> authorities = userDetails.getAuthorities().stream()
                        .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
                        .collect(java.util.stream.Collectors.toList());

                // Add role from token if it exists and is not already in authorities
                if (role != null && !role.isEmpty()) {
                    String roleAuthority = "ROLE_" + role.toUpperCase();
                    if (authorities.stream().noneMatch(a -> a.getAuthority().equals(roleAuthority))) {
                        authorities.add(new SimpleGrantedAuthority(roleAuthority));
                    }
                }

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        authorities
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}

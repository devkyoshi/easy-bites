package com.ds.authservice.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class UserAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private  ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String userJson = request.getHeader("X-User");

        if (userJson != null) {
            try {
              Map<String, Object> userMap = objectMapper.readValue(userJson, new TypeReference<>() {});
                String username = (String) userMap.get("username");
                Long userId = ((Number) userMap.get("userId")).longValue();
                String email = (String) userMap.get("email");
                String firstName = (String) userMap.get("firstName");
                String lastName = (String) userMap.get("lastName");

                List<String> roles = ((List<?>) userMap.get("roles")).stream()
                        .filter(String.class::isInstance)
                        .map(String.class::cast)
                        .toList();

                if (username != null) {
                    List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                    CustomUserDetails userDetails = new CustomUserDetails( userId, firstName, lastName, email, roles);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (IOException e) {
                logger.error("Failed to parse X-User header", e);
            }
        }

        chain.doFilter(request, response);
    }
}

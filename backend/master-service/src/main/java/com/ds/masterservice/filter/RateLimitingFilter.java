package com.ds.masterservice.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Component
@WebFilter(urlPatterns = "/auth/login, /auth/register")  // Apply filter to login and register
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final ConcurrentHashMap<String, Bucket> cache = new ConcurrentHashMap<>();
    private static final Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1))); // 5 requests per minute

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String ipAddress = request.getRemoteAddr();
        Bucket bucket = cache.computeIfAbsent(ipAddress, key -> Bucket4j.builder().addLimit(limit).build());

        // Check if the rate limit is exceeded
        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);  // Allow request if within limit
        } else {
            response.setStatus(429);  // Return HTTP 429 if limit is exceeded
            response.getWriter().write("Rate limit exceeded. Please try again later.");
        }
    }
}

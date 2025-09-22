package com.ds.masterservice.service.security;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class BruteForceProtectionService {

    private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPT = 5;
    private static final long LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

    private final Map<String, Long> lockCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
        lockCache.remove(key);
    }

    public void loginFailed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0);
        attempts++;
        attemptsCache.put(key, attempts);

        if (attempts >= MAX_ATTEMPT) {
            lockCache.put(key, System.currentTimeMillis() + LOCK_TIME_MS);
        }
    }

    public boolean isBlocked(String key) {
        if (!lockCache.containsKey(key)) {
            return false;
        }
        long lockExpiry = lockCache.get(key);
        if (System.currentTimeMillis() > lockExpiry) {
            lockCache.remove(key);
            attemptsCache.remove(key);
            return false;
        }
        return true;
    }
}


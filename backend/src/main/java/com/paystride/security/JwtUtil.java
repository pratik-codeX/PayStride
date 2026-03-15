package com.paystride.security;

import com.paystride.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import com.paystride.entity.Worker;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("companyId", user.getCompany().getId());
        claims.put("role", user.getRole().name());
        claims.put("name", user.getName());

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }
	public String generateWorkerToken(Worker worker) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("workerId", worker.getId());
    claims.put("companyId", worker.getCompany().getId());
    claims.put("role", "WORKER");
    claims.put("name", worker.getName());

    return Jwts.builder()
            .claims(claims)
            .subject(worker.getWorkerCode())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
}

public Long extractWorkerId(String token) {
    Object workerId = extractAllClaims(token).get("workerId");
    if (workerId == null) return null;
    return Long.valueOf(workerId.toString());
}

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractCompanyId(String token) {
        Object companyId = extractAllClaims(token).get("companyId");
        return Long.valueOf(companyId.toString());
    }

    public Long extractUserId(String token) {
        Object userId = extractAllClaims(token).get("userId");
        return Long.valueOf(userId.toString());
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}


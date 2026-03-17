package com.paystride.controller;


import org.springframework.security.core.Authentication;
import java.util.HashMap;
import java.util.Map;
import com.paystride.dto.AuthResponse;
import com.paystride.dto.LoginRequest;
import com.paystride.dto.RegisterRequest;
import com.paystride.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

   @PostMapping("/change-password")
public ResponseEntity<Map<String, Object>> changePassword(
        @RequestBody Map<String, String> body,
        Authentication authentication) {
    String oldPassword = body.get("oldPassword");
    String newPassword = body.get("newPassword");
    authService.changePassword(oldPassword, newPassword, authentication);
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Password changed successfully");
    return ResponseEntity.ok(response);
}

@PostMapping("/forgot-password")
public ResponseEntity<Map<String, Object>> forgotPassword(
        @RequestBody Map<String, String> body) {
    String email = body.get("email");
    String newPassword = body.get("newPassword");
    authService.forgotPassword(email, newPassword);
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Password reset successfully");
    return ResponseEntity.ok(response);
}
}

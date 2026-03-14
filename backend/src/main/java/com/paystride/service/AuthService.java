package com.paystride.service;

import com.paystride.dto.AuthResponse;
import com.paystride.dto.LoginRequest;
import com.paystride.dto.RegisterRequest;
import com.paystride.entity.Company;
import com.paystride.entity.User;
import com.paystride.entity.UserRole;
import com.paystride.repository.CompanyRepository;
import com.paystride.repository.UserRepository;
import com.paystride.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(CompanyRepository companyRepository,
                       UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getAdminEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Company company = new Company();
        company.setName(request.getCompanyName());
        company.setCity(request.getCompanyCity());
        company.setEmail(request.getCompanyEmail());
        Company savedCompany = companyRepository.save(company);

        User user = new User();
        user.setCompany(savedCompany);
        user.setName(request.getAdminName());
        user.setEmail(request.getAdminEmail());
        user.setPassword(passwordEncoder.encode(request.getAdminPassword()));
        user.setRole(UserRole.ADMIN);
        user.setActive(true);
        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedCompany.getId(),
                savedUser.getName(),
                savedUser.getRole().name(),
                savedCompany.getName()
        );
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Account disabled");
        }

        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getCompany().getId(),
                user.getName(),
                user.getRole().name(),
                user.getCompany().getName()
        );
    }
}


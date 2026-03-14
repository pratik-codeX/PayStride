package com.paystride.dto;

public class AuthResponse {

    private String token;
    private Long userId;
    private Long companyId;
    private String name;
    private String role;
    private String companyName;

    public AuthResponse(String token, Long userId, Long companyId,
                        String name, String role, String companyName) {
        this.token = token;
        this.userId = userId;
        this.companyId = companyId;
        this.name = name;
        this.role = role;
        this.companyName = companyName;
    }

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public Long getCompanyId() { return companyId; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getCompanyName() { return companyName; }
}

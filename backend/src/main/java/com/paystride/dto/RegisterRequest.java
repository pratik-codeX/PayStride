package com.paystride.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    private String companyCity;

    @Email
    @NotBlank(message = "Company email is required")
    private String companyEmail;

    @NotBlank(message = "Admin name is required")
    private String adminName;

    @Email
    @NotBlank(message = "Admin email is required")
    private String adminEmail;

    @NotBlank
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String adminPassword;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyCity() { return companyCity; }
    public void setCompanyCity(String companyCity) { this.companyCity = companyCity; }

    public String getCompanyEmail() { return companyEmail; }
    public void setCompanyEmail(String companyEmail) { this.companyEmail = companyEmail; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }
}

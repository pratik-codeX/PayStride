package com.paystride.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String companyName;

    @Size(max = 60, message = "City must be at most 60 characters")
    private String companyCity;

    @Email(message = "Enter a valid company email address")
    @NotBlank(message = "Company email is required")
    private String companyEmail;

    @NotBlank(message = "Company contact is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit contact number")
    private String companyContact;

    @NotBlank(message = "Admin name is required")
    @Size(min = 2, max = 80, message = "Admin name must be between 2 and 80 characters")
    @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]*$", message = "Admin name contains invalid characters")
    private String adminName;

    @Email(message = "Enter a valid admin email address")
    @NotBlank(message = "Admin email is required")
    private String adminEmail;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}$",
        message = "Password must include uppercase, lowercase, number, and special character"
    )
    private String adminPassword;

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyCity() { return companyCity; }
    public void setCompanyCity(String companyCity) { this.companyCity = companyCity; }

    public String getCompanyEmail() { return companyEmail; }
    public void setCompanyEmail(String companyEmail) { this.companyEmail = companyEmail; }

    public String getCompanyContact() { return companyContact; }
    public void setCompanyContact(String companyContact) { this.companyContact = companyContact; }

    public String getAdminName() { return adminName; }
    public void setAdminName(String adminName) { this.adminName = adminName; }

    public String getAdminEmail() { return adminEmail; }
    public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }

    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }
}

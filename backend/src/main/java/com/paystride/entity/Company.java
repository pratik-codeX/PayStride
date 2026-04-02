package com.paystride.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;
    private String city;

    @NotBlank
    private String email;

    @NotBlank
    @Column(name = "contact_number")
    private String contactNumber;

    @CreationTimestamp
    private LocalDateTime createdAt;
public Long getId() { return id; }
public String getName() { return name; }
public String getCity() { return city; }
public String getEmail() { return email; }
public String getContactNumber() { return contactNumber; }
public java.time.LocalDateTime getCreatedAt() { return createdAt; }
public void setId(Long id) { this.id = id; }
public void setName(String name) { this.name = name; }
public void setCity(String city) { this.city = city; }
public void setEmail(String email) { this.email = email; }
public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

}

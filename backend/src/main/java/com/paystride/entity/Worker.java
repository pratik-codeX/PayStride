package com.paystride.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "workers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @NotBlank
    private String name;
    private String phone;
    private String department;

    @Column(name = "hourly_rate", precision = 10, scale = 2)
    @NotNull
    private BigDecimal hourlyRate;

    @Column(name = "joining_date")
    private LocalDate joiningDate;
	
	@Column(name = "worker_code", unique = true)
	private String workerCode;

	@Column(name = "password")
	private String password;
	
    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

public String getWorkerCode() { return workerCode; }
public void setWorkerCode(String workerCode) { this.workerCode = workerCode; }

//public String getPassword() { return password; }
//public void setPassword(String password) { this.password = password; }

public Long getId() { return id; }
public Company getCompany() { return company; }
public String getName() { return name; }
public String getPhone() { return phone; }
public String getDepartment() { return department; }
public BigDecimal getHourlyRate() { return hourlyRate; }
public java.time.LocalDate getJoiningDate() { return joiningDate; }
public boolean isActive() { return active; }
//public String getWorkerCode() { return workerCode; }
public String getPassword() { return password; }
public java.time.LocalDateTime getCreatedAt() { return createdAt; }

public void setId(Long id) { this.id = id; }
public void setCompany(Company company) { this.company = company; }
public void setName(String name) { this.name = name; }
public void setPhone(String phone) { this.phone = phone; }
public void setDepartment(String department) { this.department = department; }
public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
public void setJoiningDate(java.time.LocalDate joiningDate) { this.joiningDate = joiningDate; }
public void setActive(boolean active) { this.active = active; }
//public void setWorkerCode(String workerCode) { this.workerCode = workerCode; }
public void setPassword(String password) { this.password = password; }
}

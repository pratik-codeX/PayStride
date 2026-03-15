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

public String getPassword() { return password; }
public void setPassword(String password) { this.password = password; }

}

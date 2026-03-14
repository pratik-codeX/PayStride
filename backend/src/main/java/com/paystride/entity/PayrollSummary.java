package com.paystride.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll_summary", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"worker_id", "month_year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "month_year", nullable = false, length = 7)
    private String monthYear;

    @Column(name = "total_hours", precision = 8, scale = 1)
    private BigDecimal totalHours;

    @Column(name = "regular_hours", precision = 8, scale = 1)
    private BigDecimal regularHours;

    @Column(name = "overtime_hours", precision = 8, scale = 1)
    private BigDecimal overtimeHours;

    @Column(name = "gross_pay", precision = 10, scale = 2)
    private BigDecimal grossPay;

    @Column(name = "pf_deduction", precision = 10, scale = 2)
    private BigDecimal pfDeduction;

    @Column(name = "esi_deduction", precision = 10, scale = 2)
    private BigDecimal esiDeduction;

    @Column(name = "net_pay", precision = 10, scale = 2)
    private BigDecimal netPay;

    @CreationTimestamp
    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt;
}

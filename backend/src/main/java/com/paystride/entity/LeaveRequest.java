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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
@Getter
@Setter
@NoArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "leave_date", nullable = false)
    private LocalDate leaveDate;

    @Column(name = "leave_type", length = 20)
    private String leaveType;

    @Column(length = 500)
    private String reason;

    @Column(length = 20)
    private String status;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    @Column(name = "review_note")
    private String reviewNote;

    @CreationTimestamp
    @Column(name = "requested_at", updatable = false)
    private LocalDateTime requestedAt;

    public Long getId() { return id; }
    public Worker getWorker() { return worker; }
    public Company getCompany() { return company; }
    public LocalDate getLeaveDate() { return leaveDate; }
    public String getLeaveType() { return leaveType; }
    public String getReason() { return reason; }
    public String getStatus() { return status; }
    public Long getReviewedBy() { return reviewedBy; }
    public String getReviewNote() { return reviewNote; }
    public LocalDateTime getRequestedAt() { return requestedAt; }

    public void setWorker(Worker worker) { this.worker = worker; }
    public void setCompany(Company company) { this.company = company; }
    public void setLeaveDate(LocalDate leaveDate) { this.leaveDate = leaveDate; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }
    public void setReason(String reason) { this.reason = reason; }
    public void setStatus(String status) { this.status = status; }
    public void setReviewedBy(Long reviewedBy) { this.reviewedBy = reviewedBy; }
    public void setReviewNote(String reviewNote) { this.reviewNote = reviewNote; }
}

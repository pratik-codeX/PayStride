package com.paystride.dto;

import com.paystride.entity.PayrollSummary;
import java.math.BigDecimal;

public class PayrollResponse {

    private Long workerId;
    private String workerName;
    private String workerPhone;
    private String department;
    private String monthYear;
    private BigDecimal totalHours;
    private BigDecimal regularHours;
    private BigDecimal overtimeHours;
    private BigDecimal grossPay;
    private BigDecimal pfDeduction;
    private BigDecimal esiDeduction;
    private BigDecimal netPay;

    public static PayrollResponse from(PayrollSummary summary) {
        PayrollResponse r = new PayrollResponse();
        r.workerId = summary.getWorker().getId();
        r.workerName = summary.getWorker().getName();
        r.workerPhone = summary.getWorker().getPhone();
        r.department = summary.getWorker().getDepartment();
        r.monthYear = summary.getMonthYear();
        r.totalHours = summary.getTotalHours();
        r.regularHours = summary.getRegularHours();
        r.overtimeHours = summary.getOvertimeHours();
        r.grossPay = summary.getGrossPay();
        r.pfDeduction = summary.getPfDeduction();
        r.esiDeduction = summary.getEsiDeduction();
        r.netPay = summary.getNetPay();
        return r;
    }

    public Long getWorkerId() { return workerId; }
    public String getWorkerName() { return workerName; }
    public String getWorkerPhone() { return workerPhone; }
    public String getDepartment() { return department; }
    public String getMonthYear() { return monthYear; }
    public BigDecimal getTotalHours() { return totalHours; }
    public BigDecimal getRegularHours() { return regularHours; }
    public BigDecimal getOvertimeHours() { return overtimeHours; }
    public BigDecimal getGrossPay() { return grossPay; }
    public BigDecimal getPfDeduction() { return pfDeduction; }
    public BigDecimal getEsiDeduction() { return esiDeduction; }
    public BigDecimal getNetPay() { return netPay; }
}
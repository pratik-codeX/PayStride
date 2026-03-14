package com.paystride.dto;

import com.paystride.entity.PayrollSummary;
import java.math.BigDecimal;

public class PayrollResponse {

    private Long workerId;
    private String workerName;
    private String department;
    private String monthYear;
    private BigDecimal totalHours;
    private BigDecimal regularHours;
    private BigDecimal overtimeHours;
    private BigDecimal grossPay;
    private BigDecimal pfDeduction;
    private BigDecimal esiDeduction;
    private BigDecimal netPay;

    public static PayrollResponse from(PayrollSummary ps) {
        PayrollResponse r = new PayrollResponse();
        r.workerId = ps.getWorker().getId();
        r.workerName = ps.getWorker().getName();
        r.department = ps.getWorker().getDepartment();
        r.monthYear = ps.getMonthYear();
        r.totalHours = ps.getTotalHours();
        r.regularHours = ps.getRegularHours();
        r.overtimeHours = ps.getOvertimeHours();
        r.grossPay = ps.getGrossPay();
        r.pfDeduction = ps.getPfDeduction();
        r.esiDeduction = ps.getEsiDeduction();
        r.netPay = ps.getNetPay();
        return r;
    }

    public Long getWorkerId() { return workerId; }
    public String getWorkerName() { return workerName; }
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

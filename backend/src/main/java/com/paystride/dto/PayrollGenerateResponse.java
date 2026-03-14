package com.paystride.dto;

import java.math.BigDecimal;
import java.util.List;

public class PayrollGenerateResponse {

    private String monthYear;
    private int totalWorkers;
    private BigDecimal totalGrossPay;
    private BigDecimal totalNetPay;
    private List<PayrollResponse> records;

    public PayrollGenerateResponse(String monthYear,
                                   int totalWorkers,
                                   BigDecimal totalGrossPay,
                                   BigDecimal totalNetPay,
                                   List<PayrollResponse> records) {
        this.monthYear = monthYear;
        this.totalWorkers = totalWorkers;
        this.totalGrossPay = totalGrossPay;
        this.totalNetPay = totalNetPay;
        this.records = records;
    }

    public String getMonthYear() { return monthYear; }
    public int getTotalWorkers() { return totalWorkers; }
    public BigDecimal getTotalGrossPay() { return totalGrossPay; }
    public BigDecimal getTotalNetPay() { return totalNetPay; }
    public List<PayrollResponse> getRecords() { return records; }
}

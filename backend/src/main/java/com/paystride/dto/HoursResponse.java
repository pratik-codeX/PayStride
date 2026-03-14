package com.paystride.dto;

import com.paystride.entity.DailyHours;
import java.math.BigDecimal;
import java.time.LocalDate;

public class HoursResponse {

    private Long id;
    private Long workerId;
    private String workerName;
    private LocalDate workDate;
    private BigDecimal hoursWorked;

    public static HoursResponse from(DailyHours dh) {
        HoursResponse response = new HoursResponse();
        response.id = dh.getId();
        response.workerId = dh.getWorker().getId();
        response.workerName = dh.getWorker().getName();
        response.workDate = dh.getWorkDate();
        response.hoursWorked = dh.getHoursWorked();
        return response;
    }

    public Long getId() { return id; }
    public Long getWorkerId() { return workerId; }
    public String getWorkerName() { return workerName; }
    public LocalDate getWorkDate() { return workDate; }
    public BigDecimal getHoursWorked() { return hoursWorked; }
}

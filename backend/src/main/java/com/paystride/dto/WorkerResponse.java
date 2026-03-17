package com.paystride.dto;

import com.paystride.entity.Worker;
import java.math.BigDecimal;
import java.time.LocalDate;

public class WorkerResponse {

    private Long id;
    private String name;
    private String phone;
    private String department;
    private BigDecimal hourlyRate;
    private LocalDate joiningDate;
    private boolean active;
    private String workerCode;

    public static WorkerResponse from(Worker worker) {
        WorkerResponse response = new WorkerResponse();
        response.id = worker.getId();
        response.name = worker.getName();
        response.phone = worker.getPhone();
        response.department = worker.getDepartment();
        response.hourlyRate = worker.getHourlyRate();
        response.joiningDate = worker.getJoiningDate();
        response.active = worker.isActive();
        response.workerCode = worker.getWorkerCode();
        return response;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getDepartment() { return department; }
    public BigDecimal getHourlyRate() { return hourlyRate; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public boolean isActive() { return active; }
    public String getWorkerCode() { return workerCode; }
}

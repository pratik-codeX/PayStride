package com.paystride.dto;

public class WorkerAuthResponse {

    private String token;
    private Long workerId;
    private Long companyId;
    private String name;
    private String role;
    private String department;
    private String workerCode;

    public WorkerAuthResponse(String token, Long workerId, Long companyId,
                               String name, String role, String department,
                               String workerCode) {
        this.token = token;
        this.workerId = workerId;
        this.companyId = companyId;
        this.name = name;
        this.role = role;
        this.department = department;
        this.workerCode = workerCode;
    }

    public String getToken() { return token; }
    public Long getWorkerId() { return workerId; }
    public Long getCompanyId() { return companyId; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getDepartment() { return department; }
    public String getWorkerCode() { return workerCode; }
}

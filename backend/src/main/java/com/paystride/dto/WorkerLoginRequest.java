package com.paystride.dto;

import jakarta.validation.constraints.NotBlank;

public class WorkerLoginRequest {

    @NotBlank(message = "Worker ID is required")
    private String workerCode;

    @NotBlank(message = "Password is required")
    private String password;

    public String getWorkerCode() { return workerCode; }
    public void setWorkerCode(String workerCode) { this.workerCode = workerCode; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

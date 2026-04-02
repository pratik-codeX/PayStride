package com.paystride.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class HoursUpdateRequest {

    @NotNull(message = "Hours worked is required")
    @DecimalMin(value = "0.5", message = "Minimum 0.5 hours")
    @DecimalMax(value = "24.0", message = "Maximum 24 hours")
    private BigDecimal hoursWorked;

    public BigDecimal getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(BigDecimal hoursWorked) { this.hoursWorked = hoursWorked; }
}

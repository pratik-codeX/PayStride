package com.paystride.controller;

import com.paystride.dto.PayrollGenerateResponse;
import com.paystride.dto.PayrollResponse;
import com.paystride.service.PayrollService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    private final PayrollService payrollService;

    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }

    @PostMapping("/generate")
    public ResponseEntity<PayrollGenerateResponse> generatePayroll(
            @RequestParam String monthYear) {
        return ResponseEntity.ok(
            payrollService.generatePayroll(monthYear));
    }

    @GetMapping
    public ResponseEntity<List<PayrollResponse>> getPayroll(
            @RequestParam String monthYear) {
        return ResponseEntity.ok(
            payrollService.getPayroll(monthYear));
    }
}

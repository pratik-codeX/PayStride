package com.paystride.controller;

import com.paystride.dto.HoursResponse;
import com.paystride.dto.PayrollResponse;
import com.paystride.dto.WorkerAuthResponse;
import com.paystride.dto.WorkerLoginRequest;
import com.paystride.security.JwtUtil;
import com.paystride.service.WorkerPortalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/worker")
public class WorkerPortalController {

    private final WorkerPortalService workerPortalService;
    private final JwtUtil jwtUtil;

    public WorkerPortalController(WorkerPortalService workerPortalService,
                                   JwtUtil jwtUtil) {
        this.workerPortalService = workerPortalService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<WorkerAuthResponse> login(
            @Valid @RequestBody WorkerLoginRequest request) {
        return ResponseEntity.ok(workerPortalService.login(request));
    }

    @GetMapping("/my-hours")
    public ResponseEntity<List<HoursResponse>> getMyHours(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String monthYear) {
        String token = authHeader.substring(7);
        Long workerId = jwtUtil.extractWorkerId(token);
        return ResponseEntity.ok(workerPortalService.getMyHours(workerId, monthYear));
    }

    @GetMapping("/my-payroll")
    public ResponseEntity<List<PayrollResponse>> getMyPayroll(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long workerId = jwtUtil.extractWorkerId(token);
        return ResponseEntity.ok(workerPortalService.getMyPayroll(workerId));
    }

    @PostMapping("/advance-request")
    public ResponseEntity<Map<String, Object>> requestAdvance(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {
        String token = authHeader.substring(7);
        Long workerId = jwtUtil.extractWorkerId(token);
        Long companyId = jwtUtil.extractCompanyId(token);
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String reason = (String) body.get("reason");
        String monthYear = (String) body.get("monthYear");
        return ResponseEntity.ok(
            workerPortalService.requestAdvance(workerId, companyId, amount, reason, monthYear));
    }

    @GetMapping("/my-advances")
    public ResponseEntity<List<Map<String, Object>>> getMyAdvances(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long workerId = jwtUtil.extractWorkerId(token);
        return ResponseEntity.ok(workerPortalService.getMyAdvances(workerId));
    }
}

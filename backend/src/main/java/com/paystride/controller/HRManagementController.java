package com.paystride.controller;

import com.paystride.entity.AdvanceRequest;
import com.paystride.entity.LeaveRequest;
import com.paystride.repository.AdvanceRequestRepository;
import com.paystride.repository.LeaveRequestRepository;
import com.paystride.security.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hr")
public class HRManagementController {

    private final AdvanceRequestRepository advanceRequestRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public HRManagementController(
            AdvanceRequestRepository advanceRequestRepository,
            LeaveRequestRepository leaveRequestRepository) {
        this.advanceRequestRepository = advanceRequestRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    @GetMapping("/advances")
    public ResponseEntity<List<Map<String, Object>>> getAdvances(
            @RequestParam(required = false) String status) {
        Long companyId = TenantContext.get();
        List<AdvanceRequest> advances;
        if (status != null && !status.isEmpty()) {
            advances = advanceRequestRepository
                .findByCompanyIdAndStatusOrderByRequestedAtDesc(companyId, status);
        } else {
            advances = advanceRequestRepository
                .findByCompanyIdOrderByRequestedAtDesc(companyId);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (AdvanceRequest a : advances) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("workerId", a.getWorker().getId());
            map.put("workerName", a.getWorker().getName());
            map.put("workerCode", a.getWorker().getWorkerCode());
            map.put("amount", a.getAmount());
            map.put("reason", a.getReason());
            map.put("monthYear", a.getMonthYear());
            map.put("status", a.getStatus());
            map.put("reviewNote", a.getReviewNote());
            map.put("requestedAt", a.getRequestedAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/advances/{id}/review")
    public ResponseEntity<Map<String, Object>> reviewAdvance(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Long companyId = TenantContext.get();
        AdvanceRequest advance = advanceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Advance request not found"));
        if (!advance.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Access denied");
        }
        advance.setStatus(body.get("status"));
        advance.setReviewNote(body.get("reviewNote"));
        advanceRequestRepository.save(advance);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Advance request " + body.get("status").toLowerCase());
        response.put("status", advance.getStatus());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<Map<String, Object>>> getLeaves(
            @RequestParam(required = false) String status) {
        Long companyId = TenantContext.get();
        List<LeaveRequest> leaves;
        if (status != null && !status.isEmpty()) {
            leaves = leaveRequestRepository
                .findByCompanyIdAndStatusOrderByRequestedAtDesc(companyId, status);
        } else {
            leaves = leaveRequestRepository
                .findByCompanyIdOrderByRequestedAtDesc(companyId);
        }
        List<Map<String, Object>> result = new ArrayList<>();
        for (LeaveRequest l : leaves) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", l.getId());
            map.put("workerId", l.getWorker().getId());
            map.put("workerName", l.getWorker().getName());
            map.put("workerCode", l.getWorker().getWorkerCode());
            map.put("leaveDate", l.getLeaveDate());
            map.put("leaveType", l.getLeaveType());
            map.put("reason", l.getReason());
            map.put("status", l.getStatus());
            map.put("reviewNote", l.getReviewNote());
            map.put("requestedAt", l.getRequestedAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/leaves/{id}/review")
    public ResponseEntity<Map<String, Object>> reviewLeave(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Long companyId = TenantContext.get();
        LeaveRequest leave = leaveRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Leave request not found"));
        if (!leave.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Access denied");
        }
        leave.setStatus(body.get("status"));
        leave.setReviewNote(body.get("reviewNote"));
        leaveRequestRepository.save(leave);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Leave request " + body.get("status").toLowerCase());
        response.put("status", leave.getStatus());
        return ResponseEntity.ok(response);
    }
}

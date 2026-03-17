package com.paystride.controller;

import com.paystride.dto.WorkerRequest;
import com.paystride.dto.WorkerResponse;
import com.paystride.service.WorkerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    private final WorkerService workerService;

    public WorkerController(WorkerService workerService) {
        this.workerService = workerService;
    }

    @GetMapping
    public ResponseEntity<List<WorkerResponse>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponse> getWorkerById(
            @PathVariable Long id) {
        return ResponseEntity.ok(workerService.getWorkerById(id));
    }

    @PostMapping
    public ResponseEntity<WorkerResponse> createWorker(
            @Valid @RequestBody WorkerRequest request) {
        return ResponseEntity.ok(workerService.createWorker(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkerResponse> updateWorker(
            @PathVariable Long id,
            @Valid @RequestBody WorkerRequest request) {
        return ResponseEntity.ok(workerService.updateWorker(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Map<String, Object>> resetWorkerPassword(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        String newPassword = body == null ? null : body.get("newPassword");
        workerService.resetWorkerPassword(id, newPassword);
        Map<String, Object> response = new HashMap<>();
        response.put("message", newPassword == null || newPassword.isBlank()
            ? "Worker password reset to phone number successfully"
            : "Worker password updated successfully");
        return ResponseEntity.ok(response);
    }
}

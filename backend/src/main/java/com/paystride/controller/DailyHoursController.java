package com.paystride.controller;

import com.paystride.dto.HoursRequest;
import com.paystride.dto.HoursResponse;
import com.paystride.dto.HoursUpdateRequest;
import com.paystride.entity.User;
import com.paystride.service.DailyHoursService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/hours")
public class DailyHoursController {

    private final DailyHoursService dailyHoursService;

    public DailyHoursController(DailyHoursService dailyHoursService) {
        this.dailyHoursService = dailyHoursService;
    }

    @GetMapping
    public ResponseEntity<List<HoursResponse>> getHoursForDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {
        return ResponseEntity.ok(dailyHoursService.getHoursForDate(date));
    }

    @PostMapping
    public ResponseEntity<HoursResponse> logHours(
            @Valid @RequestBody HoursRequest request,
            Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
            dailyHoursService.logHours(request, currentUser.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HoursResponse> updateHours(
            @PathVariable Long id,
            @Valid @RequestBody HoursUpdateRequest request) {
        return ResponseEntity.ok(dailyHoursService.updateHours(id, request));
    }
}

package com.paystride.controller;

import com.paystride.repository.PayrollSummaryRepository;
import com.paystride.repository.WorkerRepository;
import com.paystride.security.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final WorkerRepository workerRepository;
    private final PayrollSummaryRepository payrollSummaryRepository;

    public DashboardController(WorkerRepository workerRepository,
                               PayrollSummaryRepository payrollSummaryRepository) {
        this.workerRepository = workerRepository;
        this.payrollSummaryRepository = payrollSummaryRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Long companyId = TenantContext.get();

        String monthYear = LocalDate.now()
            .format(DateTimeFormatter.ofPattern("yyyy-MM"));

        int totalWorkers = workerRepository
            .findByCompanyIdAndActiveTrue(companyId).size();

        List summaries = payrollSummaryRepository
            .findByCompanyIdAndMonthYear(companyId, monthYear);

        BigDecimal totalHours = BigDecimal.ZERO;
        BigDecimal totalWageLiability = BigDecimal.ZERO;

        for (Object obj : summaries) {
            com.paystride.entity.PayrollSummary ps =
                (com.paystride.entity.PayrollSummary) obj;
            totalHours = totalHours.add(ps.getTotalHours());
            totalWageLiability = totalWageLiability.add(ps.getGrossPay());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalWorkers", totalWorkers);
        response.put("totalHoursThisMonth", totalHours);
        response.put("totalWageLiabilityThisMonth", totalWageLiability);
        response.put("monthYear", monthYear);

        return ResponseEntity.ok(response);
    }
}

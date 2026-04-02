package com.paystride.service;

import com.paystride.entity.PayrollSummary;
import com.paystride.entity.Worker;
import com.paystride.repository.DailyHoursRepository;
import com.paystride.repository.PayrollSummaryRepository;
import com.paystride.repository.WorkerRepository;
import com.paystride.security.TenantContext;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final WorkerRepository workerRepository;
    private final PayrollSummaryRepository payrollSummaryRepository;
    private final DailyHoursRepository dailyHoursRepository;

    public DashboardService(WorkerRepository workerRepository,
                             PayrollSummaryRepository payrollSummaryRepository,
                             DailyHoursRepository dailyHoursRepository) {
        this.workerRepository = workerRepository;
        this.payrollSummaryRepository = payrollSummaryRepository;
        this.dailyHoursRepository = dailyHoursRepository;
    }

    public Map<String, Object> getDashboardStats() {
        Long companyId = TenantContext.get();

        long totalWorkers = workerRepository.countByCompanyIdAndActiveTrue(companyId);

        LocalDate now = LocalDate.now();
        String currentMonth = now.getYear() + "-" +
            String.format("%02d", now.getMonthValue());

        LocalDate from = LocalDate.of(now.getYear(), now.getMonth(), 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());

        BigDecimal totalHours = dailyHoursRepository
            .sumHoursByCompanyIdAndDateBetween(companyId, from, to);
        if (totalHours == null) totalHours = BigDecimal.ZERO;

        List<PayrollSummary> summaries = payrollSummaryRepository
            .findByCompanyIdAndMonthYear(companyId, currentMonth);

        BigDecimal wageLiability = summaries.stream()
            .map(PayrollSummary::getGrossPay)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> response = new HashMap<>();
        response.put("totalWorkers", totalWorkers);
        response.put("totalHoursThisMonth", totalHours);
        response.put("totalWageLiabilityThisMonth", wageLiability);
        response.put("monthYear", currentMonth);
        return response;
    }

    public Map<String, Object> getAnalytics(Long companyId) {
        Map<String, Object> result = new HashMap<>();

        // 1. Department breakdown
        List<Worker> workers = workerRepository.findByCompanyIdAndActiveTrue(companyId);

        Map<String, Long> deptCount = new LinkedHashMap<>();
        for (Worker w : workers) {
            String dept = w.getDepartment() != null ? w.getDepartment() : "Unassigned";
            deptCount.merge(dept, 1L, Long::sum);
        }

        List<Map<String, Object>> deptData = new ArrayList<>();
        for (Map.Entry<String, Long> entry : deptCount.entrySet()) {
            Map<String, Object> d = new HashMap<>();
            d.put("department", entry.getKey());
            d.put("workers", entry.getValue());
            deptData.add(d);
        }
        result.put("departmentBreakdown", deptData);

        // 2. Monthly payroll trend — last 6 months
        List<Map<String, Object>> trend = new ArrayList<>();
        LocalDate now = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            LocalDate month = now.minusMonths(i);
            String monthYear = month.getYear() + "-" +
                String.format("%02d", month.getMonthValue());

            List<PayrollSummary> summaries = payrollSummaryRepository
                .findByCompanyIdAndMonthYear(companyId, monthYear);

            BigDecimal totalNet = summaries.stream()
                .map(PayrollSummary::getNetPay)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalGross = summaries.stream()
                .map(PayrollSummary::getGrossPay)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> t = new HashMap<>();
            t.put("month", monthYear);
            t.put("netPay", totalNet);
            t.put("grossPay", totalGross);
            t.put("workers", summaries.size());
            trend.add(t);
        }
        result.put("monthlyTrend", trend);

        // 3. Overtime by worker — current month
        String currentMonth = now.getYear() + "-" +
            String.format("%02d", now.getMonthValue());

        List<PayrollSummary> currentPayroll = payrollSummaryRepository
            .findByCompanyIdAndMonthYear(companyId, currentMonth);

        List<Map<String, Object>> overtime = new ArrayList<>();
        for (PayrollSummary ps : currentPayroll) {
            if (ps.getOvertimeHours() != null &&
                ps.getOvertimeHours().compareTo(BigDecimal.ZERO) > 0) {
                Map<String, Object> o = new HashMap<>();
                o.put("worker", ps.getWorker().getName());
                o.put("overtimeHours", ps.getOvertimeHours());
                overtime.add(o);
            }
        }
        result.put("overtimeData", overtime);
        result.put("currentMonth", currentMonth);

        return result;
    }
}

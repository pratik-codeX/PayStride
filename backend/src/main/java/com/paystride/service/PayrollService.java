package com.paystride.service;

import com.paystride.dto.PayrollGenerateResponse;
import com.paystride.dto.PayrollResponse;
import com.paystride.entity.DailyHours;
import com.paystride.entity.PayrollSummary;
import com.paystride.entity.Worker;
import com.paystride.repository.DailyHoursRepository;
import com.paystride.repository.PayrollSummaryRepository;
import com.paystride.repository.WorkerRepository;
import com.paystride.security.TenantContext;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PayrollService {

    private final WorkerRepository workerRepository;
    private final DailyHoursRepository dailyHoursRepository;
    private final PayrollSummaryRepository payrollSummaryRepository;

    public PayrollService(WorkerRepository workerRepository,
                          DailyHoursRepository dailyHoursRepository,
                          PayrollSummaryRepository payrollSummaryRepository) {
        this.workerRepository = workerRepository;
        this.dailyHoursRepository = dailyHoursRepository;
        this.payrollSummaryRepository = payrollSummaryRepository;
    }

    public PayrollGenerateResponse generatePayroll(String monthYear) {
        Long companyId = TenantContext.get();

        int year = Integer.parseInt(monthYear.split("-")[0]);
        int month = Integer.parseInt(monthYear.split("-")[1]);

        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());

        List<Worker> workers =
            workerRepository.findByCompanyIdAndActiveTrue(companyId);

        List<PayrollResponse> records = new ArrayList<>();
        BigDecimal totalGrossPay = BigDecimal.ZERO;
        BigDecimal totalNetPay = BigDecimal.ZERO;

        for (Worker worker : workers) {
            List<DailyHours> hoursList =
                dailyHoursRepository.findByWorkerIdAndWorkDateBetween(
                    worker.getId(), from, to);

            BigDecimal totalHours = BigDecimal.ZERO;
            Set<LocalDate> distinctDates = new HashSet<>();

            for (DailyHours dh : hoursList) {
                totalHours = totalHours.add(dh.getHoursWorked());
                distinctDates.add(dh.getWorkDate());
            }

            int workingDays = distinctDates.size();
            BigDecimal standardHoursPerDay = new BigDecimal("8");
            BigDecimal maxRegularHours =
                standardHoursPerDay.multiply(
                    BigDecimal.valueOf(workingDays));

            BigDecimal regularHours = totalHours.min(maxRegularHours);
            BigDecimal overtimeHours =
                totalHours.subtract(regularHours).max(BigDecimal.ZERO);

            BigDecimal hourlyRate = worker.getHourlyRate();

            BigDecimal regularPay =
                regularHours.multiply(hourlyRate);

            BigDecimal overtimePay =
                overtimeHours
                    .multiply(hourlyRate)
                    .multiply(new BigDecimal("1.5"));

            BigDecimal grossPay =
                regularPay.add(overtimePay)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal pfDeduction =
                grossPay.multiply(new BigDecimal("0.12"))
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal esiDeduction =
                grossPay.multiply(new BigDecimal("0.0075"))
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal netPay =
                grossPay.subtract(pfDeduction).subtract(esiDeduction)
                    .setScale(2, RoundingMode.HALF_UP);

            Optional<PayrollSummary> existing =
                payrollSummaryRepository
                    .findByWorkerIdAndMonthYear(worker.getId(), monthYear);

            PayrollSummary summary;
            if (existing.isPresent()) {
                summary = existing.get();
            } else {
                summary = new PayrollSummary();
                summary.setWorker(worker);
                summary.setCompany(worker.getCompany());
                summary.setMonthYear(monthYear);
            }

            summary.setTotalHours(totalHours.setScale(1, RoundingMode.HALF_UP));
            summary.setRegularHours(regularHours.setScale(1, RoundingMode.HALF_UP));
            summary.setOvertimeHours(overtimeHours.setScale(1, RoundingMode.HALF_UP));
            summary.setGrossPay(grossPay);
            summary.setPfDeduction(pfDeduction);
            summary.setEsiDeduction(esiDeduction);
            summary.setNetPay(netPay);

            PayrollSummary saved = payrollSummaryRepository.save(summary);
            records.add(PayrollResponse.from(saved));

            totalGrossPay = totalGrossPay.add(grossPay);
            totalNetPay = totalNetPay.add(netPay);
        }

        return new PayrollGenerateResponse(
            monthYear,
            workers.size(),
            totalGrossPay.setScale(2, RoundingMode.HALF_UP),
            totalNetPay.setScale(2, RoundingMode.HALF_UP),
            records
        );
    }

    public List<PayrollResponse> getPayroll(String monthYear) {
        Long companyId = TenantContext.get();
        List<PayrollSummary> summaries =
            payrollSummaryRepository
                .findByCompanyIdAndMonthYear(companyId, monthYear);
        List<PayrollResponse> responses = new ArrayList<>();
        for (PayrollSummary ps : summaries) {
            responses.add(PayrollResponse.from(ps));
        }
        return responses;
    }
}


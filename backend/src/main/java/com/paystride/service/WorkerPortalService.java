package com.paystride.service;

import com.paystride.dto.HoursResponse;
import com.paystride.dto.PayrollResponse;
import com.paystride.dto.WorkerAuthResponse;
import com.paystride.dto.WorkerLoginRequest;
import com.paystride.entity.AdvanceRequest;
import com.paystride.entity.DailyHours;
import com.paystride.entity.PayrollSummary;
import com.paystride.entity.Worker;
import com.paystride.repository.AdvanceRequestRepository;
import com.paystride.repository.DailyHoursRepository;
import com.paystride.repository.PayrollSummaryRepository;
import com.paystride.repository.WorkerRepository;
import com.paystride.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WorkerPortalService {

    private final WorkerRepository workerRepository;
    private final DailyHoursRepository dailyHoursRepository;
    private final PayrollSummaryRepository payrollSummaryRepository;
    private final AdvanceRequestRepository advanceRequestRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public WorkerPortalService(WorkerRepository workerRepository,
                                DailyHoursRepository dailyHoursRepository,
                                PayrollSummaryRepository payrollSummaryRepository,
                                AdvanceRequestRepository advanceRequestRepository,
                                PasswordEncoder passwordEncoder,
                                JwtUtil jwtUtil) {
        this.workerRepository = workerRepository;
        this.dailyHoursRepository = dailyHoursRepository;
        this.payrollSummaryRepository = payrollSummaryRepository;
        this.advanceRequestRepository = advanceRequestRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public WorkerAuthResponse login(WorkerLoginRequest request) {
        Worker worker = workerRepository
            .findByWorkerCode(request.getWorkerCode())
            .orElseThrow(() -> new RuntimeException("Invalid Worker ID or password"));

        if (worker.getPassword() == null) {
            throw new RuntimeException("Password not set. Contact your HR.");
        }

        if (!passwordEncoder.matches(request.getPassword(), worker.getPassword())) {
            throw new RuntimeException("Invalid Worker ID or password");
        }

        if (!worker.isActive()) {
            throw new RuntimeException("Your account is inactive. Contact HR.");
        }

        String token = jwtUtil.generateWorkerToken(worker);

        return new WorkerAuthResponse(
            token,
            worker.getId(),
            worker.getCompany().getId(),
            worker.getName(),
            "WORKER",
            worker.getDepartment(),
            worker.getWorkerCode()
        );
    }

    public List<HoursResponse> getMyHours(Long workerId, String monthYear) {
        int year = Integer.parseInt(monthYear.split("-")[0]);
        int month = Integer.parseInt(monthYear.split("-")[1]);
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());

        List<DailyHours> hours =
            dailyHoursRepository.findByWorkerIdAndWorkDateBetween(workerId, from, to);

        List<HoursResponse> responses = new ArrayList<>();
        for (DailyHours dh : hours) {
            responses.add(HoursResponse.from(dh));
        }
        return responses;
    }

    public List<PayrollResponse> getMyPayroll(Long workerId) {
        List<PayrollSummary> summaries =
            payrollSummaryRepository.findByWorkerIdOrderByMonthYearDesc(workerId);
        List<PayrollResponse> responses = new ArrayList<>();
        for (PayrollSummary ps : summaries) {
            responses.add(PayrollResponse.from(ps));
        }
        return responses;
    }

    public Map<String, Object> requestAdvance(Long workerId, Long companyId,
                                               BigDecimal amount, String reason,
                                               String monthYear) {
        Worker worker = workerRepository.findById(workerId)
            .orElseThrow(() -> new RuntimeException("Worker not found"));

        AdvanceRequest req = new AdvanceRequest();
        req.setWorker(worker);
        req.setCompany(worker.getCompany());
        req.setAmount(amount);
        req.setReason(reason);
        req.setMonthYear(monthYear);
        req.setStatus("PENDING");

        AdvanceRequest saved = advanceRequestRepository.save(req);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("amount", saved.getAmount());
        response.put("status", saved.getStatus());
        response.put("message", "Advance request submitted successfully");
        return response;
    }

    public List<Map<String, Object>> getMyAdvances(Long workerId) {
        List<AdvanceRequest> advances =
            advanceRequestRepository.findByWorkerIdOrderByRequestedAtDesc(workerId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (AdvanceRequest a : advances) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", a.getId());
            map.put("amount", a.getAmount());
            map.put("reason", a.getReason());
            map.put("monthYear", a.getMonthYear());
            map.put("status", a.getStatus());
            map.put("reviewNote", a.getReviewNote());
            map.put("requestedAt", a.getRequestedAt());
            result.add(map);
        }
        return result;
    }
}

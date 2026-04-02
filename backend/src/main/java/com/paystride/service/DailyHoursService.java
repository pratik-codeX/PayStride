package com.paystride.service;

import com.paystride.dto.HoursRequest;
import com.paystride.dto.HoursResponse;
import com.paystride.dto.HoursUpdateRequest;
import com.paystride.entity.Company;
import com.paystride.entity.DailyHours;
import com.paystride.entity.Worker;
import com.paystride.repository.CompanyRepository;
import com.paystride.repository.DailyHoursRepository;
import com.paystride.repository.WorkerRepository;
import com.paystride.security.TenantContext;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DailyHoursService {

    private final DailyHoursRepository dailyHoursRepository;
    private final WorkerRepository workerRepository;
    private final CompanyRepository companyRepository;

    public DailyHoursService(DailyHoursRepository dailyHoursRepository,
                              WorkerRepository workerRepository,
                              CompanyRepository companyRepository) {
        this.dailyHoursRepository = dailyHoursRepository;
        this.workerRepository = workerRepository;
        this.companyRepository = companyRepository;
    }

    public List<HoursResponse> getHoursForDate(LocalDate date) {
        Long companyId = TenantContext.get();
        List<DailyHours> hours =
            dailyHoursRepository.findByCompanyIdAndWorkDate(companyId, date);
        List<HoursResponse> responses = new ArrayList<>();
        for (DailyHours dh : hours) {
            responses.add(HoursResponse.from(dh));
        }
        return responses;
    }

    public HoursResponse logHours(HoursRequest request, Long loggedByUserId) {
        Long companyId = TenantContext.get();

        Worker worker = workerRepository
            .findByIdAndCompanyId(request.getWorkerId(), companyId)
            .orElseThrow(() -> new RuntimeException("Worker not found"));

        dailyHoursRepository
            .findByWorkerIdAndWorkDate(
                request.getWorkerId(), request.getWorkDate())
            .ifPresent(existing -> {
                throw new RuntimeException(
                    "Hours already logged for this worker on " +
                    request.getWorkDate() +
                    ". Use update instead.");
            });

        Company company = companyRepository
            .findById(companyId)
            .orElseThrow(() -> new RuntimeException("Company not found"));

        DailyHours dailyHours = new DailyHours();
        dailyHours.setWorker(worker);
        dailyHours.setCompany(company);
        dailyHours.setWorkDate(request.getWorkDate());
        dailyHours.setHoursWorked(request.getHoursWorked());
        dailyHours.setLoggedBy(loggedByUserId);

        DailyHours saved = dailyHoursRepository.save(dailyHours);
        return HoursResponse.from(saved);
    }

    public HoursResponse updateHours(Long id, HoursUpdateRequest request) {
        Long companyId = TenantContext.get();

        DailyHours dailyHours = dailyHoursRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Hours record not found"));

        if (!dailyHours.getCompany().getId().equals(companyId)) {
            throw new RuntimeException("Access denied");
        }

        dailyHours.setHoursWorked(request.getHoursWorked());
        DailyHours updated = dailyHoursRepository.save(dailyHours);
        return HoursResponse.from(updated);
    }
}

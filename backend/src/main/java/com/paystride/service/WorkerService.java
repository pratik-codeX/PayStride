package com.paystride.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.paystride.dto.WorkerRequest;
import com.paystride.dto.WorkerResponse;
import com.paystride.entity.Company;
import com.paystride.entity.Worker;
import com.paystride.repository.CompanyRepository;
import com.paystride.repository.WorkerRepository;
import com.paystride.security.TenantContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final CompanyRepository companyRepository;

    private final PasswordEncoder passwordEncoder;

public WorkerService(WorkerRepository workerRepository,
                     CompanyRepository companyRepository,
                     PasswordEncoder passwordEncoder) {
    this.workerRepository = workerRepository;
    this.companyRepository = companyRepository;
    this.passwordEncoder = passwordEncoder;
}

    public List<WorkerResponse> getAllWorkers() {
        Long companyId = TenantContext.get();
        List<Worker> workers =
            workerRepository.findByCompanyIdAndActiveTrue(companyId);
        List<WorkerResponse> responses = new ArrayList<>();
        for (Worker worker : workers) {
            responses.add(WorkerResponse.from(worker));
        }
        return responses;
    }

    public WorkerResponse getWorkerById(Long id) {
        Long companyId = TenantContext.get();
        Worker worker = workerRepository
            .findByIdAndCompanyId(id, companyId)
            .orElseThrow(() ->
                new RuntimeException("Worker not found"));
        return WorkerResponse.from(worker);
    }

    public WorkerResponse createWorker(WorkerRequest request) {
        Long companyId = TenantContext.get();
        Company company = companyRepository
            .findById(companyId)
            .orElseThrow(() ->
                new RuntimeException("Company not found"));

        Worker worker = new Worker();
        worker.setCompany(company);
        worker.setName(request.getName());
        worker.setPhone(request.getPhone());
        worker.setDepartment(request.getDepartment());
        worker.setHourlyRate(request.getHourlyRate());
        worker.setJoiningDate(request.getJoiningDate());
        worker.setActive(true);
	// Auto-generate worker code: WRK001, WRK002 etc
long count = workerRepository.count() + 1;
worker.setWorkerCode("WRK" + String.format("%03d", count));
// Default password is their phone number, or "password123" if no phone
String defaultPassword = (request.getPhone() != null && !request.getPhone().isEmpty())
    ? request.getPhone()
    : "password123";
worker.setPassword(passwordEncoder.encode(defaultPassword));

        Worker saved = workerRepository.save(worker);
        return WorkerResponse.from(saved);
    }

    public WorkerResponse updateWorker(Long id, WorkerRequest request) {
        Long companyId = TenantContext.get();
        Worker worker = workerRepository
            .findByIdAndCompanyId(id, companyId)
            .orElseThrow(() ->
                new RuntimeException("Worker not found"));

        worker.setName(request.getName());
        worker.setPhone(request.getPhone());
        worker.setDepartment(request.getDepartment());
        worker.setHourlyRate(request.getHourlyRate());
        worker.setJoiningDate(request.getJoiningDate());

        Worker updated = workerRepository.save(worker);
        return WorkerResponse.from(updated);
    }

    public void deleteWorker(Long id) {
        Long companyId = TenantContext.get();
        Worker worker = workerRepository
            .findByIdAndCompanyId(id, companyId)
            .orElseThrow(() ->
                new RuntimeException("Worker not found"));
        worker.setActive(false);
        workerRepository.save(worker);
    }
}

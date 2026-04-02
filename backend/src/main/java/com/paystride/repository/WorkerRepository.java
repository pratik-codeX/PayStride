package com.paystride.repository;

import com.paystride.entity.DailyHours;
import com.paystride.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {

    List<Worker> findByCompanyIdAndActiveTrue(Long companyId);

    List<Worker> findByCompanyId(Long companyId);

    Optional<Worker> findByWorkerCode(String workerCode);

    long countByCompanyIdAndActiveTrue(Long companyId);

    long countByCompanyId(Long companyId);

    boolean existsByWorkerCode(String workerCode);

	Optional<DailyHours> findByIdAndCompanyId(Long workerId, Long companyId);
}

package com.paystride.repository;

import com.paystride.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findByCompanyIdAndActiveTrue(Long companyId);
    Optional<Worker> findByIdAndCompanyId(Long id, Long companyId);
}

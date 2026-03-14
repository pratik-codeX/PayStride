package com.paystride.repository;

import com.paystride.entity.PayrollSummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollSummaryRepository extends JpaRepository<PayrollSummary, Long> {

    List<PayrollSummary> findByCompanyIdAndMonthYear(Long companyId, String monthYear);

    Optional<PayrollSummary> findByWorkerIdAndMonthYear(Long workerId, String monthYear);
}

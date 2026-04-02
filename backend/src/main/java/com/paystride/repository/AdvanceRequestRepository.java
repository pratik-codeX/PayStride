package com.paystride.repository;

import com.paystride.entity.AdvanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdvanceRequestRepository extends JpaRepository<AdvanceRequest, Long> {

    List<AdvanceRequest> findByWorkerIdOrderByRequestedAtDesc(Long workerId);

    List<AdvanceRequest> findByCompanyIdOrderByRequestedAtDesc(Long companyId);

    List<AdvanceRequest> findByCompanyIdAndStatusOrderByRequestedAtDesc(
        Long companyId, String status);
}

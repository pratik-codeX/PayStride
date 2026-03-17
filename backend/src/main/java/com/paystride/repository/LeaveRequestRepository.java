package com.paystride.repository;

import com.paystride.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByWorkerIdOrderByRequestedAtDesc(Long workerId);

    List<LeaveRequest> findByCompanyIdOrderByRequestedAtDesc(Long companyId);

    List<LeaveRequest> findByCompanyIdAndStatusOrderByRequestedAtDesc(
        Long companyId, String status);
}

package com.paystride.repository;

import com.paystride.entity.DailyHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyHoursRepository extends JpaRepository<DailyHours, Long> {

    List<DailyHours> findByCompanyIdAndWorkDate(Long companyId, LocalDate workDate);

    List<DailyHours> findByWorkerIdAndWorkDateBetween(Long workerId, LocalDate from, LocalDate to);

    Optional<DailyHours> findByWorkerIdAndWorkDate(Long workerId, LocalDate workDate);

    @Query("SELECT SUM(d.hoursWorked) FROM DailyHours d WHERE d.company.id = :companyId AND d.workDate BETWEEN :from AND :to")
    BigDecimal sumHoursByCompanyIdAndDateBetween(
        @Param("companyId") Long companyId,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to);
}
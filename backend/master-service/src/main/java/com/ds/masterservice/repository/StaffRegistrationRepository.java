package com.ds.masterservice.repository;

import com.ds.masterservice.dao.authService.StaffRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRegistrationRepository extends JpaRepository<StaffRegistration, Long> {

    List<StaffRegistration> findStaffRegistrationByIsApprovedFalse();
}

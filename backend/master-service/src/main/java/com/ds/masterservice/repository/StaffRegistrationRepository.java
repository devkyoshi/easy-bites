package com.ds.masterservice.repository;

import com.ds.masterservice.dao.StaffRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRegistrationRepository extends JpaRepository<StaffRegistration, Long> {
}

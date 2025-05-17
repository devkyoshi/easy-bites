package com.ds.masterservice.repository;

import com.ds.masterservice.dao.authService.Customer;
import com.ds.masterservice.dao.authService.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
   /* UserDetails findUserByUsername(String username);*/
    Optional<User> findUserByUsername(String username);

    Optional<User> findUserByEmail(String email);

    @Query("SELECT c FROM Customer c WHERE c.id = :id")
    Optional<Customer> findCustomerById(int id);
}

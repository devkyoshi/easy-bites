package com.ds.masterservice.repository;

import com.ds.masterservice.dao.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
   /* UserDetails findUserByUsername(String username);*/
    Optional<User> findUserByUsername(String email);
}

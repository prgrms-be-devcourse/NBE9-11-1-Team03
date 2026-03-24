package com.back.team03.javachip.domain.customer.repository;

import com.back.team03.javachip.domain.customer.entity.Customers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customers,Long> {
    Optional<Customers> findByEmail(String email);
}
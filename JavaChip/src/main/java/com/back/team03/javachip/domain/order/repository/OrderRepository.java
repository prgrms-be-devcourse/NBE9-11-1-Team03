package com.back.team03.javachip.domain.order.repository;

import com.back.team03.javachip.domain.customer.entity.Customers;
import com.back.team03.javachip.domain.order.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    Optional<Orders> findByCustomerAndOrderTimeBetween(
            Customers customers,
            LocalDateTime start,
            LocalDateTime end
    );
}

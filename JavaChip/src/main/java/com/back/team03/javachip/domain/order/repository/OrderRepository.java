package com.back.team03.javachip.domain.order.repository;

import com.back.team03.javachip.domain.customer.entity.Customer;
import com.back.team03.javachip.domain.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByCustomerAndOrderTimeBetween(
            Customer customer,
            LocalDateTime start,
            LocalDateTime end
    );
}

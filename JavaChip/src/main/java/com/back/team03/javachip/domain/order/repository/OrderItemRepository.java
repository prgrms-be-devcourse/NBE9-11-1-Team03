package com.back.team03.javachip.domain.order.repository;

import com.back.team03.javachip.domain.order.entity.Orders;
import com.back.team03.javachip.domain.order.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItems, Long> {
    Optional<OrderItems> findByOrder(Orders orders);
}

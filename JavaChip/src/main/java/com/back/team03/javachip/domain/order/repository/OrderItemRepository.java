package com.back.team03.javachip.domain.order.repository;

import com.back.team03.javachip.domain.order.entity.Order;
import com.back.team03.javachip.domain.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrder(Order order);
}

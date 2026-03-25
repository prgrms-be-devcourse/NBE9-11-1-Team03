package com.back.team03.javachip.domain.order.scheduler;

import com.back.team03.javachip.domain.order.entity.Orders;
import com.back.team03.javachip.domain.order.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class OrderScheduler {

    private final OrderRepository orderRepository;

    public OrderScheduler(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // 매일 오후 2시에 실행
    @Scheduled(cron = "0 0 14 * * *")
    public void updateOrderState() {
        LocalDateTime end = LocalDateTime.now()
                .toLocalDate().atTime(14, 0);

        // 오늘 14:00 이전에 접수된 미완료 주문 전부
        List<Orders> orders = orderRepository
                .findAllByIsOrderStateFalseAndOrderTimeBefore(end);

        orders.forEach(order -> order.setOrderState(true));
        orderRepository.saveAll(orders);

        System.out.println("[Scheduler] 배송 완료 처리: " + orders.size() + "건");

        System.out.println("[Scheduler] end 기준시간: " + end);
        System.out.println("[Scheduler] 대상 주문 수: " + orders.size());
        orders.forEach(order ->
                System.out.println("  → 주문ID: " + order.getOrderId()
                        + " 시간: " + order.getOrderTime())
        );
    }


}
package com.back.team03.javachip.domain.order.controller;

import com.back.team03.javachip.domain.order.dto.OrderDto;
import com.back.team03.javachip.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    // 주문 생성 (프론트 결제하기 버튼)
    @PostMapping
    public ResponseEntity<OrderDto.Response> createOrder(@RequestBody OrderDto.Request orderReqdto) {
        OrderDto.Response response = orderService.createOrder(orderReqdto);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto.Response>> getOrders() {  // ← email 없으면 전체 조회

        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 주문 단건 조회 (결제 페이지에서 주문 확인)
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto.Response> getOrder(@PathVariable Long orderId) {
        OrderDto.Response response = orderService.getOrderbyId(orderId);
        return ResponseEntity.ok(response);
    }

    // 배송 묶기 조회 (관리자용)
    @GetMapping("/delivery")
    public ResponseEntity<List<OrderDto.Response>> getOrdersForDelivery(
            @RequestParam String email) {
        return ResponseEntity.ok(orderService.getOrdersForDelivery(email));
    }
}

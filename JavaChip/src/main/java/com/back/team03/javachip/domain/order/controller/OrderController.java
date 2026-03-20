package com.back.team03.javachip.domain.order.controller;

import com.back.team03.javachip.domain.order.dto.OrderDto;
import com.back.team03.javachip.domain.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // 주문 단건 조회 (결제 페이지에서 주문 확인)
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto.Response> getOrder(@PathVariable Long orderId) {
        OrderDto.Response response = orderService.getOrder(orderId);
        return ResponseEntity.ok(response);
    }
}

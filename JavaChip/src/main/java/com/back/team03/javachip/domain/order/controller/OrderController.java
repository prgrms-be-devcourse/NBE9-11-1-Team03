package com.back.team03.javachip.domain.order.controller;



import com.back.team03.javachip.domain.order.dto.OrderRequestDto;
import com.back.team03.javachip.domain.order.dto.OrderResponseDto;
import com.back.team03.javachip.domain.order.dto.OrderUpdateRequest;
import com.back.team03.javachip.domain.order.entity.Orders;
import com.back.team03.javachip.domain.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/orders")
@Tag(name = "주문 API", description = "주문 생성 및 조회 관련 API")
public class OrderController {

    private final OrderService orderService;

    // 주문 생성
    @PostMapping
    @Operation(summary = "주문 생성", description = "상품을 선택하고 주문을 생성합니다.")
    public ResponseEntity<OrderResponseDto> createOrder(
            @RequestBody @Valid OrderRequestDto dto) {
        return ResponseEntity.ok(orderService.createOrder(dto));
    }

    // 전체 주문 조회 or 이메일로 조회
    @GetMapping
    @Operation(summary = "주문 조회", description = "전체 주문 조회 또는 이메일로 조회합니다.")
    public ResponseEntity<List<OrderResponseDto>> getOrders(
            @RequestParam(required = false) String email) {
        if (email != null) {
            return ResponseEntity.ok(orderService.getOrdersByEmail(email));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 주문 ID로 조회
    @GetMapping("/{orderId}")
    @Operation(summary = "주문 단건 조회", description = "주문 ID로 단건 조회합니다.")
    public ResponseEntity<OrderResponseDto> getOrderById(
            @PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    // 배송 묶음 조회
    @GetMapping("/delivery")
    @Operation(summary = "배송 묶음 조회", description = "오후 2시 기준 당일 주문 묶음을 조회합니다.")
    public ResponseEntity<List<OrderResponseDto>> getOrdersForDelivery(
            @RequestParam String email) {
        return ResponseEntity.ok(orderService.getOrdersForDelivery(email));
    }

    @PatchMapping("/{orderId}")
    @Operation(summary = "주문 수정", description = "주문 정보를 수정합니다.")
    public ResponseEntity<OrderResponseDto> updateOrder(
            @PathVariable Long orderId,
            @RequestBody OrderUpdateRequest dto) {
        return ResponseEntity.ok(orderService.updateOrder(orderId, dto));
    }

    @DeleteMapping("/{orderId}")
    @Operation(summary = "주문 삭제", description = "주문을 삭제합니다.")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
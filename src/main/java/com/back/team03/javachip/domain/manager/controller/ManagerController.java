package com.back.team03.javachip.domain.manager.controller;

import com.back.team03.javachip.domain.manager.dto.ManagerLoginRequestDto;
import com.back.team03.javachip.domain.manager.dto.ManagerLoginResponseDto;
import com.back.team03.javachip.domain.manager.service.ManagerService;
import com.back.team03.javachip.domain.order.dto.OrderResponseDto;
import com.back.team03.javachip.domain.order.service.OrderService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;
    private final OrderService orderService;

    /// 로그인

    @PostMapping("/login")
    public ResponseEntity<ManagerLoginResponseDto> login(
            @RequestBody ManagerLoginRequestDto requestDto,
            HttpSession session) {

        ManagerLoginResponseDto response = managerService.login(requestDto, session);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        managerService.logout(session);
        return ResponseEntity.ok("로그아웃 성공");
    }


    ///  조회
    // 전체 주문 조회
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDto>> getAllOrders(HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 이메일별 조회
    @GetMapping("/orders/email")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByEmail(
            @RequestParam String email, HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getOrdersByEmail(email));
    }

    // 품목별 조회
    @GetMapping("/orders/product")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByProduct(
            @RequestParam Long prodId, HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getOrdersByProduct(prodId));
    }

    // 상태별 조회
    @GetMapping("/orders/state")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByState(
            @RequestParam boolean isOrderState, HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getOrdersByState(isOrderState));
    }

    // 오후 2시 기준 미완료 주문 묶음 조회
    @GetMapping("/orders/delivery")
    public ResponseEntity<List<OrderResponseDto>> getPendingOrdersForDelivery(HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getPendingOrdersForDelivery());
    }

    // 주문 상태 변경
    @PatchMapping("/orders/{orderId}/state")
    public ResponseEntity<String> updateOrderState(
            @PathVariable Long orderId, HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        orderService.updateOrderState(orderId);
        return ResponseEntity.ok("주문 상태가 완료로 변경되었습니다.");
    }



}
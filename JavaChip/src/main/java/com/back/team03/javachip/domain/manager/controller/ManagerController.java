package com.back.team03.javachip.domain.manager.controller;

import com.back.team03.javachip.domain.manager.dto.ManagerLoginRequestDto;
import com.back.team03.javachip.domain.manager.dto.ManagerLoginResponseDto;
import com.back.team03.javachip.domain.manager.service.ManagerService;
import com.back.team03.javachip.domain.order.dto.OrderRequestDto;
import com.back.team03.javachip.domain.order.dto.OrderResponseDto;
import com.back.team03.javachip.domain.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
@Tag(name = "관리자 API", description = "관리자 로그인 및 주문 관련 API")
public class ManagerController {

    private final ManagerService managerService;
    private final OrderService orderService;

    // 로그인
    @PostMapping("/login")
    @Operation(summary = "관리자 로그인", description = "adminId와 adminPassword로 로그인합니다.")
    public ResponseEntity<ManagerLoginResponseDto> login(
            @RequestBody ManagerLoginRequestDto requestDto,
            HttpSession session) {
        return ResponseEntity.ok(managerService.login(requestDto, session));
    }

    // 로그아웃
    @PostMapping("/logout")
    @Operation(summary = "관리자 로그아웃", description = "세션을 삭제하고 로그아웃합니다.")
    public ResponseEntity<String> logout(HttpSession session) {
        managerService.logout(session);
        return ResponseEntity.ok("로그아웃 성공");
    }

    // 관리자 주문 생성
    @PostMapping("/orders")
    @Operation(summary = "관리자 주문 생성", description = "관리자가 고객 대신 주문을 생성합니다.")
    public ResponseEntity<OrderResponseDto> createOrder(
            @RequestBody OrderRequestDto dto,
            HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.createOrder(dto));
    }

    ///  관리자 주문 조회
    // 전체 주문 조회
    @GetMapping("/orders")
    @Operation(summary = "전체 주문 조회", description = "모든 주문을 조회합니다.")
    public ResponseEntity<List<OrderResponseDto>> getAllOrders(HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // 이메일별 조회
    @GetMapping("/orders/email")
    @Operation(summary = "이메일별 주문 조회", description = "고객 이메일로 주문을 조회합니다.")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByEmail(
            @Parameter(description = "고객 이메일", example = "customer@test.com")
            @RequestParam String email,
            HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getOrdersByEmail(email));
    }

    // 품목별 조회
    @GetMapping("/orders/product")
    @Operation(summary = "품목별 주문 조회", description = "상품 ID로 해당 상품이 포함된 주문을 조회합니다.")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByProduct(
            @Parameter(description = "상품 ID", example = "1")
            @RequestParam Long prodId,
            HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getOrdersByProduct(prodId));
    }

    // 상태별 조회
    @GetMapping("/orders/state")
    @Operation(summary = "상태별 주문 조회", description = "주문 상태로 조회합니다. false: 주문 접수, true: 주문 완료")
    public ResponseEntity<List<OrderResponseDto>> getOrdersByState(
            @Parameter(description = "주문 상태 (false: 주문 접수, true: 주문 완료)", example = "false")
            @RequestParam boolean isOrderState,
            HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getOrdersByState(isOrderState));
    }

    // 오후 2시 기준 미완료 주문 묶음 조회
    @GetMapping("/orders/delivery")
    @Operation(summary = "배송 묶음 조회", description = "오후 2시 기준 미완료 주문 전체를 조회합니다.")
    public ResponseEntity<List<OrderResponseDto>> getPendingOrdersForDelivery(
            HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(orderService.getPendingOrdersForDelivery());
    }

    // 주문 상태 변경
    @PatchMapping("/orders/{orderId}/state")
    @Operation(summary = "주문 상태 완료 처리", description = "주문 상태를 접수에서 완료로 변경합니다.")
    public ResponseEntity<String> updateOrderState(
            @Parameter(description = "주문 ID", example = "1")
            @PathVariable Long orderId,
            HttpSession session) {
        if (session.getAttribute("managerId") == null) return ResponseEntity.status(401).build();
        orderService.updateOrderState(orderId);
        return ResponseEntity.ok("주문 상태가 완료로 변경되었습니다.");
    }
}
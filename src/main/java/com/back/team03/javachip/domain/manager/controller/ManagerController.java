package com.back.team03.javachip.domain.manager.controller;

import com.back.team03.javachip.domain.manager.dto.ManagerLoginRequestDto;
import com.back.team03.javachip.domain.manager.dto.ManagerLoginResponseDto;
import com.back.team03.javachip.domain.manager.service.ManagerService;
import com.back.team03.javachip.domain.order.dto.OrderRequestDto;
import com.back.team03.javachip.domain.order.dto.OrderResponseDto;
import com.back.team03.javachip.domain.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {
/// @Getter @Setter 필요 X , @Valid - 선택사항

    private final ManagerService managerService;
    private final OrderService orderService;

    @PostMapping("/login") // 로그인 기능
    @Operation(summary = "관리자 로그인", description = "adminId와 adminPassword로 로그인합니다.")
    public ResponseEntity<ManagerLoginResponseDto> login(
            @RequestBody ManagerLoginRequestDto requestDto,
            HttpSession session) {

        ManagerLoginResponseDto response = managerService.login(requestDto, session);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout") // 로그아웃 기능
    @Operation(summary = "관리자 로그아웃", description = "세션을 삭제합니다.")
    public ResponseEntity<String> logout(HttpSession session) {
        managerService.logout(session);
        return ResponseEntity.ok("로그아웃 성공");
    }

    // 관리자 주문 생성
    @PostMapping("/orders")
    @Operation(summary = "관리자 주문 생성", description = "관리자가 고객 대신 주문을 생성합니다.")
    public ResponseEntity<OrderResponseDto> createOrder(
    /// 상태코드(200, 404등) 제어를 위한 ResponseEntity, <주문 결과 데이터>
            @RequestBody OrderRequestDto dto, // 클라이언트의 요청(JSON)을 OrderRequestDto로 변환
            HttpSession session) { // session - 로그인 상태 체크용

        // 세션으로 관리자 로그인 여부 확인
        if (session.getAttribute("managerId") == null) {
            return ResponseEntity.status(401).build(); // 401에러 반환
        }

        return ResponseEntity.ok(orderService.createOrder(dto)); // 주문 생성
    }


}
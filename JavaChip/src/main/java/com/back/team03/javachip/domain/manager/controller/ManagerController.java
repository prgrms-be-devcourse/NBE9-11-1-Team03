package com.back.team03.javachip.domain.manager.controller;

import com.back.team03.javachip.domain.manager.dto.ManagerLoginRequestDto;
import com.back.team03.javachip.domain.manager.dto.ManagerLoginResponseDto;
import com.back.team03.javachip.domain.manager.service.ManagerService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

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
}
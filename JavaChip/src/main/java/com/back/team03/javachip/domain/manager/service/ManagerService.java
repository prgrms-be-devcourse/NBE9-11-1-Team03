package com.back.team03.javachip.domain.manager.service;

import com.back.team03.javachip.domain.manager.dto.ManagerLoginRequestDto;
import com.back.team03.javachip.domain.manager.dto.ManagerLoginResponseDto;
import com.back.team03.javachip.domain.manager.entity.Manager;
import com.back.team03.javachip.domain.manager.repository.ManagerRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final ManagerRepository managerRepository;

    public ManagerLoginResponseDto login(ManagerLoginRequestDto requestDto,
                                         HttpSession session) {

        // adminId로 관리자 조회
        Manager manager = managerRepository.findByAdminId(requestDto.getAdminId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 관리자입니다."));

        // 비밀번호 검증
        if (!manager.getAdminPassword().equals(requestDto.getAdminPassword())) {
            throw new IllegalArgumentException("비밀번호가 올바르지 않습니다.");
        }

        // 세션에 관리자 정보 저장
        session.setAttribute("managerId", manager.getManagerId());
        session.setAttribute("adminId", manager.getAdminId());

        return new ManagerLoginResponseDto(
                manager.getManagerId(),
                manager.getAdminId(),
                "로그인 성공"
        );
    }

    public void logout(HttpSession session) {
        session.invalidate(); // 세션 초기화
    }
}

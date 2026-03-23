package com.back.team03.javachip.domain.manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ManagerLoginResponseDto {
    private Long managerId;
    private String adminId;
    private String message;
}

package com.back.team03.javachip.domain.manager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ManagerLoginRequestDto {
    private String adminId;
    private String adminPassword;
}
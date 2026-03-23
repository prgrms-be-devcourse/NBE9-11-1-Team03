package com.back.team03.javachip.domain.order.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class OrderUpdateRequest {
    private String email;
    private String detailAddress;
    private Integer quantity;
}
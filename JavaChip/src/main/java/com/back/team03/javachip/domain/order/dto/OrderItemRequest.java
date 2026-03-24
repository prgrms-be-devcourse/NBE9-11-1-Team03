package com.back.team03.javachip.domain.order.dto;

import lombok.Getter;

@Getter
public class OrderItemRequest {
    private Long productId;  // 어떤 상품을 살건지
    private Long quantity;   // 몇 개 살건지
}
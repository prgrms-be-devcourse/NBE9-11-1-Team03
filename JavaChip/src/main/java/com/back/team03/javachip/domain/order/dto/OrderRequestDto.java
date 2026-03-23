package com.back.team03.javachip.domain.order.dto;

import java.util.List;

public record OrderRequestDto(
        String email,
        String postalCode,
        String detailAddress,
        List<ItemRequest> items
) {
    public record ItemRequest(
            Long productId,
            Long prodQuantity
    ) {}
}

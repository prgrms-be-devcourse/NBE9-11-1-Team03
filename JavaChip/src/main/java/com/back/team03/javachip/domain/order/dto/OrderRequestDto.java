package com.back.team03.javachip.domain.order.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record OrderRequestDto(

        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @NotBlank(message = "이메일은 필수입니다.")
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

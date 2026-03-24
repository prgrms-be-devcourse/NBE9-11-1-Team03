package com.back.team03.javachip.domain.order.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderUpdateRequest {
    private String email;
    private String detailAddress;
    private List<ItemUpdateRequest> items;

    @Getter
    @Setter
    public static class ItemUpdateRequest {
        private Long productId;
        private Integer quantity;
    }
}
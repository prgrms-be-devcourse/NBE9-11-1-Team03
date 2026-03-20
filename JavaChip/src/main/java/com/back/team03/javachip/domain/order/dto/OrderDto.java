package com.back.team03.javachip.domain.order.dto;

import com.back.team03.javachip.domain.order.entity.OrderItems;
import com.back.team03.javachip.domain.order.entity.Orders;

import java.time.LocalDateTime;

public class OrderDto {

    // 요청용 (프론트 → 백엔드)
    public record Request(
            String email,
            String postalCode,
            String detailAddress,
            Long productId,
            Long prodQuantity
    ) {}

    // 응답용 (백엔드 → 프론트)
    public record Response(
            Long orderId,
            String email,
            String postalCode,
            String detailAddress,
            LocalDateTime orderTime,
            Long productId,
            Long prodQuantity,
            Long prodPrice
    ) {
        public Response(Orders order, OrderItems orderItem) {
            this(
                    order.getOrderId(),
                    order.getCustomers().getEmail(),
                    order.getPostalCode(),
                    order.getDetailAddress(),
                    order.getOrderTime(),
                    orderItem.getProduct().getProdId(),
                    orderItem.getProdQuantity(),
                    orderItem.getProdPrice()
            );
        }
    }
}

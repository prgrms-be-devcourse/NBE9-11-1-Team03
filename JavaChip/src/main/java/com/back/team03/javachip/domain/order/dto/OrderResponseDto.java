package com.back.team03.javachip.domain.order.dto;


import com.back.team03.javachip.domain.order.entity.OrderItems;
import com.back.team03.javachip.domain.order.entity.Orders;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDto(
        Long orderId,
        String email,
        String postalCode,
        String detailAddress,
        LocalDateTime orderTime,
        Long totalPrice,
        List<ItemResponse> items
) {
    public record ItemResponse(
            Long productId,
            String prodName,
            Long prodQuantity,
            Long prodPrice
    ) {}

    public OrderResponseDto(Orders order, List<OrderItems> orderItems) {
        this(
                order.getOrderId(),
                order.getCustomer().getEmail(),
                order.getPostalCode(),
                order.getDetailAddress(),
                order.getOrderTime(),
                orderItems.stream()
                        .mapToLong(OrderItems::getProdPrice)
                        .sum(),
                orderItems.stream()
                        .map(item -> new ItemResponse(
                                item.getProduct().getProdId(),
                                item.getProduct().getProdName(),
                                item.getProdQuantity(),
                                item.getProdPrice()
                        ))
                        .toList()
        );
    }
}
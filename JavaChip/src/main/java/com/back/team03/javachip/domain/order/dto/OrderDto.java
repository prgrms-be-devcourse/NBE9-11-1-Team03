package com.back.team03.javachip.domain.order.dto;

import com.back.team03.javachip.domain.order.entity.Orders;

public record OrderDto(
    String email,
    String postal_code,
    String detail_addres,
    Long product_id,
    Long prod_quantity
    ) {
    public OrderDto(Orders orders){
        this(
                orders.getCustomers().getEmail(),
                orders.getPostal_code(),
                orders.getDetail_address(),
                null,  // OrderItem에서 가져와야 함
                null
        );
    }
}


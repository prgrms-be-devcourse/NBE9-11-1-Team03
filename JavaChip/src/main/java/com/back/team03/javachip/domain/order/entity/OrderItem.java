package com.back.team03.javachip.domain.order.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Getter
@NoArgsConstructor
public class OrderItem {

    @Id
    private Long product_id;

    @Id
    private Long order_id;

    @Column(nullable = false)
    private Long prod_quantity;

    @Column(nullable = false)
    private Long prod_price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;


    // 제품 entity todo
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "product_id")
//    private Product product;
}

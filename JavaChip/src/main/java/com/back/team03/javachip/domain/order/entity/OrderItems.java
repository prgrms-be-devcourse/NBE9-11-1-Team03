package com.back.team03.javachip.domain.order.entity;

import com.back.team03.javachip.domain.product.entity.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderDetailId;

    // N:1
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Orders order;

    // N:1
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private Long prodQuantity;

    @Column(nullable = false)
    private Long prodPrice;
}
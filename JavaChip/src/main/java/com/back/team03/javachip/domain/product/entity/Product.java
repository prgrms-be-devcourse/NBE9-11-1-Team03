package com.back.team03.javachip.domain.product.entity;

import com.back.team03.javachip.domain.order.entity.OrderItems;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prodId;

    @Column(nullable = false)
    private String prodName;

    @Column(nullable = false)
    private Long prodPrice;

    @Column(nullable = false)
    private String description;

    @OneToMany(mappedBy = "product")
    private List<OrderItems> orderItems = new ArrayList<>();
}
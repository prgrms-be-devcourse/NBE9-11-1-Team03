package com.back.team03.javachip.domain.order.entity;

import com.back.team03.javachip.domain.customer.entity.Customers;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long order_id;

    @Column(nullable = false, unique = true)
    private String postal_code;

    @Column(nullable = false)
    private String detail_address;

    @Column(nullable = false)
    private LocalDateTime order_time;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coustomer_id")
    private Customers customers;


}

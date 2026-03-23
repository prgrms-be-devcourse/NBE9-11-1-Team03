package com.back.team03.javachip.domain.customer.entity;
import com.back.team03.javachip.domain.order.entity.Orders;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customers")
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    @Column(nullable = false)
    private String email;

    @OneToMany(mappedBy = "customer")
    private List<Orders> orders = new ArrayList<>();
}

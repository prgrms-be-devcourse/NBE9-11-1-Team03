package com.back.team03.javachip.domain.customer.entity;
import com.back.team03.javachip.domain.order.entity.Orders;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
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
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @OneToMany(mappedBy = "customers")
    private List<Orders> orders = new ArrayList<>();
}

package com.back.team03.javachip.domain.order.entity;

import jakarta.persistence.*;
import lombok.*;

import com.back.team03.javachip.domain.customer.entity.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders") // order는 예약어라 명시 추천
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false)
    private String detailAddress;

    @Column(nullable = false)
    private LocalDateTime orderTime;

    @ManyToOne(fetch = FetchType.LAZY) //양방향관계에서 무한순환 참조해결을위해 lazy 추가
    @JoinColumn(name = "customer_id")
    private Customers customers;

    @OneToMany(mappedBy = "order")
    private List<OrderItems> orderItems = new ArrayList<>();
}

package com.back.team03.javachip.domain.order.entity;

import com.back.team03.javachip.domain.customer.entity.Customers;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

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

    @JsonProperty("isOrderState") // Jackson이 is를 제거하지 않도록 필드명 고정
    @Column(nullable = false) // 관리자에서 주문 상태 조회를 위한 컬럼
    private boolean isOrderState = false; // false: 주문 접수, true: 주문 완료

}
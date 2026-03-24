package com.back.team03.javachip.domain.order.repository;

import com.back.team03.javachip.domain.customer.entity.Customers;
import com.back.team03.javachip.domain.order.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    List<Orders> findAllByCustomers(Customers customers);

    List<Orders> findAllByCustomersAndOrderTimeBetween(
            Customers customers,
            LocalDateTime start,
            LocalDateTime end
    );

    // 상태별 조회
    List<Orders> findAllByIsOrderState(boolean isOrderState);

    // 품목별 조회 (productId로 해당 상품이 포함된 주문 조회) , DISTINCT - 중복 방지
    @Query("SELECT DISTINCT o FROM Orders o " +
            "JOIN o.orderItems oi " +
            "WHERE oi.product.prodId = :prodId")
    List<Orders> findAllByProductId(@Param("prodId") Long prodId);
    // `Orders`와 `OrderItems`는 직접 연결되어 있지 않음. 그래서 @Query로 직접 SQL을 작성

    // 오후 2시 기준 전체 미완료 주문 조회
    List<Orders> findAllByIsOrderStateAndOrderTimeBetween( // JPA가 메서드명 분석할 수 있는 이름
            boolean isOrderState,
            LocalDateTime start,
            LocalDateTime end
    ); /*
    SELECT * FROM orders
    WHERE is_order_state = ?
    AND order_time BETWEEN ? AND ?
    */


    /// 아래는 findAllByIsOrderStateAndOrderTimeBetween 와 같은 기능, 함수명 변경 시
    /*
    @Query("SELECT o FROM Orders o WHERE o.isOrderState = :isOrderState AND o.orderTime BETWEEN :start AND :end")
    List<Orders> findPendingOrdersBetween(
        @Param("isOrderState") boolean isOrderState,
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
     */

}
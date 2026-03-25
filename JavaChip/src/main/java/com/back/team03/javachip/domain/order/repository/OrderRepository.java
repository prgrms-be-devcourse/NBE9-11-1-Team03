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

    ///  관리자 조회
    // 상태별 조회
    List<Orders> findAllByIsOrderState(boolean isOrderState);

    // 품목별 조회
    @Query("SELECT DISTINCT o FROM Orders o " +
            "JOIN o.orderItems oi " +
            "WHERE oi.product.prodId = :prodId")
    List<Orders> findAllByProductId(@Param("prodId") Long prodId);

    // 오후 2시 기준 미완료 주문 조회
    List<Orders> findAllByIsOrderStateAndOrderTimeBetween( // 함수명 이유 - JPA가 자동으로
            boolean isOrderState,
            LocalDateTime start,
            LocalDateTime end
    ); /*@Query 없이도 JPA가 메서드명을 분석해서 아래 SQL을 자동 생성
    sqlSELECT * FROM orders
    WHERE is_order_state = ?
    AND order_time BETWEEN ? AND ?

    */

}
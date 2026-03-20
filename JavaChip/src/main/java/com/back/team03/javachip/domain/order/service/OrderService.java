package com.back.team03.javachip.domain.order.service;

import com.back.team03.javachip.domain.customer.entity.Customers;
import com.back.team03.javachip.domain.customer.repository.CustomerRepository;
import com.back.team03.javachip.domain.order.dto.OrderDto;
import com.back.team03.javachip.domain.order.entity.OrderItems;
import com.back.team03.javachip.domain.order.entity.Orders;
import com.back.team03.javachip.domain.order.repository.OrderItemRepository;
import com.back.team03.javachip.domain.order.repository.OrderRepository;
import com.back.team03.javachip.domain.product.entity.Product;
import com.back.team03.javachip.domain.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository  productRepository;

    public OrderDto.Response createOrder(OrderDto.Request dto) {

        // 1. 이메일로 고객 찾기, 없으면 새로 생성
        Customers customer;
        Optional<Customers> existingCustomer = customerRepository.findByEmail(dto.email());

        if (existingCustomer.isPresent()) {
            customer = existingCustomer.get();
        } else {
            customer = new Customers();
            customer.setEmail(dto.email());
            customerRepository.save(customer);
        }

        // 2. 상품 조회
        Product product;
        Optional<Product> existingProduct = productRepository.findById(dto.productId());

        if (existingProduct.isPresent()) {
            product = existingProduct.get();
        } else {
            throw new IllegalArgumentException("존재하지 않는 상품입니다.");
        }

        // 3. 오후 2시 기준 당일 주문 있는지 확인
        LocalDateTime start = getOrderStartTime();
        LocalDateTime end = start.plusDays(1);

        Orders order;
        Optional<Orders> existingOrder = orderRepository
                .findByCustomersAndOrderTimeBetween(customer, start, end);

        if (existingOrder.isPresent()) {
            order = existingOrder.get();
        } else {
            order = new Orders();
            order.setPostalCode(dto.postalCode());
            order.setDetailAddress(dto.detailAddress());
            order.setOrderTime(LocalDateTime.now());
            order.setCustomers(customer);
            orderRepository.save(order);
        }

        // 4. OrderItem 저장
        OrderItems orderItem = new OrderItems();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setProdQuantity(dto.prodQuantity());
        orderItem.setProdPrice(product.getProdPrice() * dto.prodQuantity());
        orderItemRepository.save(orderItem);

        // 5. Response 반환
        return new OrderDto.Response(order, orderItem);
    }


    public OrderDto.Response getOrder(Long orderId) {

        Optional<Orders> existingOrder = orderRepository.findById(orderId);

        if (!existingOrder.isPresent()) {
            throw new IllegalArgumentException("존재하지 않는 주문입니다.");
        }

        Orders order = existingOrder.get();

        Optional<OrderItems> existingOrderItem = orderItemRepository.findByOrder(order);

        if (!existingOrderItem.isPresent()) {
            throw new IllegalArgumentException("주문 상세 내역이 없습니다.");
        }

        OrderItems orderItem = existingOrderItem.get();

        return new OrderDto.Response(order, orderItem);
    }

    // 오후 2시 기준 시작 시간 계산
    private LocalDateTime getOrderStartTime() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayAt2pm = now.toLocalDate().atTime(14, 0);

        if (now.isBefore(todayAt2pm)) {
            return todayAt2pm.minusDays(1);
        } else {
            return todayAt2pm;
        }
    }
}

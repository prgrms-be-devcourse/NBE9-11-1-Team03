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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository  productRepository;

    public OrderDto.Response createOrder(OrderDto.Request dto) {

        // 1. 고객 찾기 or 생성
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
        Optional<Product> existingProduct = productRepository.findById(dto.productId());

        if (!existingProduct.isPresent()) {
            throw new IllegalArgumentException("존재하지 않는 상품입니다.");
        }

        Product product = existingProduct.get();

        // 3. 무조건 새 Order 생성 (주문할 때마다)
        Orders order = new Orders();
        order.setPostalCode(dto.postalCode());
        order.setDetailAddress(dto.detailAddress());
        order.setOrderTime(LocalDateTime.now());  // ← 주문시간 기록
        order.setCustomers(customer);
        orderRepository.save(order);

        // 4. OrderItem 생성
        OrderItems orderItem = new OrderItems();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setProdQuantity(dto.prodQuantity());
        orderItem.setProdPrice(product.getProdPrice() * dto.prodQuantity());
        orderItemRepository.save(orderItem);

        return new OrderDto.Response(order, orderItem);
    }

    //주문 전체 조회
    public List<OrderDto.Response> getAllOrders() {

        List<Orders> orders = orderRepository.findAll();

        if (orders.isEmpty()) {
            throw new IllegalArgumentException("주문 내역이 없습니다.");
        }

        List<OrderDto.Response> result = new ArrayList<>();

        for (Orders order : orders) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            for (OrderItems orderItem : orderItems) {
                result.add(new OrderDto.Response(order, orderItem));
            }
        }

        return result;
    }

    //주문id로 조회
    public OrderDto.Response getOrderbyId(Long orderId) {

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

    //2시를 기준으로 똑같은 이메일 주문 조회
    public List<OrderDto.Response> getOrdersForDelivery(String email) {

        // 1. 이메일로 고객 찾기
        Optional<Customers> existingCustomer = customerRepository.findByEmail(email);

        if (!existingCustomer.isPresent()) {
            throw new IllegalArgumentException("존재하지 않는 고객입니다.");
        }

        Customers customer = existingCustomer.get();

        // 2. 오후 2시 기준 시작 시간 계산
        LocalDateTime start = getOrderStartTime();
        LocalDateTime end = start.plusDays(1);

        // 3. 해당 시간 사이의 주문 전체 조회
        List<Orders> orders = orderRepository
                .findAllByCustomersAndOrderTimeBetween(customer, start, end);

        if (orders.isEmpty()) {
            throw new IllegalArgumentException("해당 시간대 주문이 없습니다.");
        }

        // 4. 각 주문의 OrderItem과 함께 반환
        List<OrderDto.Response> result = new ArrayList<>();

        for (Orders order : orders) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            for (OrderItems orderItem : orderItems) {
                result.add(new OrderDto.Response(order, orderItem));
            }
        }

        return result;
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

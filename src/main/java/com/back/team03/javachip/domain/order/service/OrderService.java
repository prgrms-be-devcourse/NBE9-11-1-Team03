package com.back.team03.javachip.domain.order.service;


import com.back.team03.javachip.domain.customer.entity.Customers;
import com.back.team03.javachip.domain.customer.repository.CustomerRepository;
import com.back.team03.javachip.domain.order.dto.OrderRequestDto;
import com.back.team03.javachip.domain.order.dto.OrderResponseDto;
import com.back.team03.javachip.domain.order.dto.OrderUpdateRequest;
import com.back.team03.javachip.domain.order.entity.OrderItems;
import com.back.team03.javachip.domain.order.entity.Orders;
import com.back.team03.javachip.domain.order.repository.OrderItemRepository;
import com.back.team03.javachip.domain.order.repository.OrderRepository;
import com.back.team03.javachip.domain.product.entity.Product;
import com.back.team03.javachip.domain.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
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
    private final ProductRepository productRepository;

    //주문 전체 조회
    public List<Orders> findAll() {
        return orderRepository.findAll();
    }

    // 주문 생성
    public OrderResponseDto createOrder(OrderRequestDto dto) {

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

        // 2. Order 1개 생성
        Orders order = new Orders();
        order.setPostalCode(dto.postalCode());
        order.setDetailAddress(dto.detailAddress());
        order.setOrderTime(LocalDateTime.now());
        order.setCustomers(customer);
        orderRepository.save(order);

        // 3. items 리스트 순회하면서 OrderItem 저장
        List<OrderItems> savedOrderItems = new ArrayList<>();

        for (OrderRequestDto.ItemRequest item : dto.items()) {

            Optional<Product> existingProduct = productRepository.findById(item.productId());

            if (!existingProduct.isPresent()) {
                throw new IllegalArgumentException("존재하지 않는 상품입니다.");
            }

            Product product = existingProduct.get();

            OrderItems orderItem = new OrderItems();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProdQuantity(item.prodQuantity());
            orderItem.setProdPrice(product.getProdPrice() * item.prodQuantity());
            orderItemRepository.save(orderItem);

            savedOrderItems.add(orderItem);
        }

        return new OrderResponseDto(order, savedOrderItems);
    }

    // 주문 전체 조회
    public List<OrderResponseDto> getAllOrders() {

        List<Orders> orders = orderRepository.findAll();

        if (orders.isEmpty()) {
            throw new IllegalArgumentException("주문 내역이 없습니다.");
        }

        List<OrderResponseDto> result = new ArrayList<>();

        for (Orders order : orders) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            result.add(new OrderResponseDto(order, orderItems));
        }

        return result;
    }

    // 주문 ID로 조회
    public OrderResponseDto getOrderById(Long orderId) {

        Optional<Orders> existingOrder = orderRepository.findById(orderId);

        if (!existingOrder.isPresent()) {
            throw new IllegalArgumentException("존재하지 않는 주문입니다.");
        }

        Orders order = existingOrder.get();

        List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);

        if (orderItems.isEmpty()) {
            throw new IllegalArgumentException("주문 상세 내역이 없습니다.");
        }

        return new OrderResponseDto(order, orderItems);
    }

    // 이메일로 주문 조회
    public List<OrderResponseDto> getOrdersByEmail(String email) {

        Optional<Customers> existingCustomer = customerRepository.findByEmail(email);

        if (!existingCustomer.isPresent()) {
            throw new IllegalArgumentException("존재하지 않는 고객입니다.");
        }

        Customers customer = existingCustomer.get();

        List<Orders> orders = orderRepository.findAllByCustomers(customer);

        if (orders.isEmpty()) {
            throw new IllegalArgumentException("주문 내역이 없습니다.");
        }

        List<OrderResponseDto> result = new ArrayList<>();

        for (Orders order : orders) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            result.add(new OrderResponseDto(order, orderItems));
        }

        return result;
    }

    // 오후 2시 기준 배송 묶음 조회
    public List<OrderResponseDto> getOrdersForDelivery(String email) {

        Optional<Customers> existingCustomer = customerRepository.findByEmail(email);

        if (!existingCustomer.isPresent()) {
            throw new IllegalArgumentException("존재하지 않는 고객입니다.");
        }

        Customers customer = existingCustomer.get();

        LocalDateTime start = getOrderStartTime();
        LocalDateTime end = start.plusDays(1);

        List<Orders> orders = orderRepository
                .findAllByCustomersAndOrderTimeBetween(customer, start, end);

        if (orders.isEmpty()) {
            throw new IllegalArgumentException("해당 시간대 주문이 없습니다.");
        }

        List<OrderResponseDto> result = new ArrayList<>();

        for (Orders order : orders) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            result.add(new OrderResponseDto(order, orderItems));
        }

        return result;
    }

    // 오후 2시 기준 시작 시간 계산
    private LocalDateTime getOrderStartTime() {
        // 테스트용 - 오후 3시로 고정 (2시 이후)
//        LocalDateTime now = LocalDateTime.of(2026, 3, 21, 15, 0);

//        // 실제 사용할 때는 아래로 변경
        LocalDateTime now = LocalDateTime.now();
//
        LocalDateTime todayAt2pm = now.toLocalDate().atTime(14, 0);

        if (now.isBefore(todayAt2pm)) {
            return todayAt2pm.minusDays(1);
        } else {
            return todayAt2pm;
        }
    }

    @Transactional
    public OrderResponseDto updateOrder(Long orderId, OrderUpdateRequest dto) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        // 1. 이메일(고객) 수정 로직
        if (dto.getEmail() != null) {
            Customers customer = customerRepository.findByEmail(dto.getEmail())
                    .orElseGet(() -> customerRepository.save(
                            Customers.builder().email(dto.getEmail()).build()
                    ));
            order.setCustomers(customer);
        }

        // 2. 주소 수정
        if (dto.getDetailAddress() != null) {
            order.setDetailAddress(dto.getDetailAddress());
        }

        // 3. 수량 및 가격 수정 (첫 번째 아이템 기준)
        if (dto.getQuantity() != null) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            if (!orderItems.isEmpty()) {
                OrderItems item = orderItems.get(0);
                item.setProdQuantity(dto.getQuantity().longValue());
                item.setProdPrice(item.getProduct().getProdPrice() * dto.getQuantity());
                orderItemRepository.save(item);
            }
        }

        return new OrderResponseDto(order, orderItemRepository.findAllByOrder(order));
    }

    // 주문 삭제 (관리자용)
    @Transactional
    public void deleteOrder(Long orderId) {
        // 1. 삭제할 주문이 DB에 있는지 확인
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        // 2. 이 주문에 연결된 상품 상세(OrderItems)를 먼저 삭제 (외래키 제약 조건 해결)
        List<OrderItems> items = orderItemRepository.findAllByOrder(order);
        if (!items.isEmpty()) {
            orderItemRepository.deleteAll(items);
        }

        // 3. 주문(Orders) 삭제
        orderRepository.delete(order);
    }
}

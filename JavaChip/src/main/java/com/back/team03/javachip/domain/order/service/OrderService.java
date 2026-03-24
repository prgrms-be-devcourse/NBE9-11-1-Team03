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

import com.back.team03.javachip.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                throw new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 상품입니다.");
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
            throw new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 주문입니다.");
        }

        Orders order = existingOrder.get();

        List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);

        if (orderItems.isEmpty()) {
            throw new CustomException(HttpStatus.NOT_FOUND, "주문 상세 내역이 없습니다.");
        }

        return new OrderResponseDto(order, orderItems);
    }

    // 이메일로 주문 조회
    public List<OrderResponseDto> getOrdersByEmail(String email) {

        Optional<Customers> existingCustomer = customerRepository.findByEmail(email);

        if (!existingCustomer.isPresent()) {
            throw new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 고객입니다.");
        }

        Customers customer = existingCustomer.get();

        List<Orders> orders = orderRepository.findAllByCustomers(customer);

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
            throw new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 고객입니다.");
        }

        Customers customer = existingCustomer.get();

        LocalDateTime start = getOrderStartTime();
        LocalDateTime end = start.plusDays(1);

        List<Orders> orders = orderRepository
                .findAllByCustomersAndOrderTimeBetween(customer, start, end);

        if (orders.isEmpty()) {
            throw new CustomException(HttpStatus.NOT_FOUND, "해당 시간대에 주문이 존재하지 않습니다.");
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

        // 1. 이메일 수정
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            Customers customer = customerRepository.findByEmail(dto.getEmail())
                    .orElseGet(() -> customerRepository.save(
                            Customers.builder().email(dto.getEmail()).build()
                    ));
            order.setCustomers(customer);
        }

        // 2. 주소 수정
        if (dto.getDetailAddress() != null && !dto.getDetailAddress().isBlank()) {
            order.setDetailAddress(dto.getDetailAddress());
        }

        // 3. 품목별 수량 수정 / 추가 / 삭제
        List<OrderItems> existingItems = orderItemRepository.findAllByOrder(order);

        if (dto.getItems() != null) {
            java.util.Map<Long, OrderItems> existingItemMap = new java.util.HashMap<>();
            for (OrderItems existingItem : existingItems) {
                existingItemMap.put(existingItem.getProduct().getProdId(), existingItem);
            }

            for (OrderUpdateRequest.ItemUpdateRequest itemDto : dto.getItems()) {
                if (itemDto.getProductId() == null || itemDto.getQuantity() == null) {
                    continue;
                }

                Long productId = itemDto.getProductId();
                Integer quantity = itemDto.getQuantity();
                OrderItems existingItem = existingItemMap.get(productId);

                // 수량이 0 이하이면 해당 품목 삭제
                if (quantity <= 0) {
                    if (existingItem != null) {
                        orderItemRepository.delete(existingItem);
                    }
                    continue;
                }

                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다. productId=" + productId));

                // 기존 품목이 있으면 수정
                if (existingItem != null) {
                    existingItem.setProdQuantity(quantity.longValue());
                    existingItem.setProdPrice(product.getProdPrice() * quantity);
                    orderItemRepository.save(existingItem);
                }
                // 기존 품목이 없으면 새로 추가
                else {
                    OrderItems newItem = new OrderItems();
                    newItem.setOrder(order);
                    newItem.setProduct(product);
                    newItem.setProdQuantity(quantity.longValue());
                    newItem.setProdPrice(product.getProdPrice() * quantity);
                    orderItemRepository.save(newItem);
                }
            }
        }

        return new OrderResponseDto(order, orderItemRepository.findAllByOrder(order));
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문입니다."));

        List<OrderItems> items = orderItemRepository.findAllByOrder(order);
        if (!items.isEmpty()) {
            orderItemRepository.deleteAll(items);
        }

        orderRepository.delete(order);
    }

    ///  관리자 조회 기능
    // 품목별 조회
    public List<OrderResponseDto> getOrdersByProduct(Long prodId) {

        productRepository.findById(prodId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 상품입니다."));

        List<Orders> orders = orderRepository.findAllByProductId(prodId);

        if (orders.isEmpty()) {
            throw new CustomException(HttpStatus.NOT_FOUND, "해당 상품의 주문이 없습니다.");
        }

        List<OrderResponseDto> result = new ArrayList<>();
        for (Orders order : orders) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            result.add(new OrderResponseDto(order, orderItems));
        }
        return result;
    }

    // 상태별 조회
    public List<OrderResponseDto> getOrdersByState(boolean isOrderState) {

        List<Orders> orders = orderRepository.findAllByIsOrderState(isOrderState);

        if (orders.isEmpty()) {
            throw new CustomException(HttpStatus.NOT_FOUND, "해당 상태의 주문이 없습니다.");
        }

        List<OrderResponseDto> result = new ArrayList<>();
        for (Orders order : orders) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            result.add(new OrderResponseDto(order, orderItems));
        }
        return result;
    }

    // 오후 2시 기준 미완료 전체 주문 조회
    public List<OrderResponseDto> getPendingOrdersForDelivery() {

        LocalDateTime start = getOrderStartTime();
        LocalDateTime end = start.plusDays(1);

        List<Orders> orders = orderRepository.findAllByIsOrderStateAndOrderTimeBetween(
                false, start, end
        );

        if (orders.isEmpty()) {
            throw new CustomException(HttpStatus.NOT_FOUND, "해당 시간대 미완료 주문이 없습니다.");
        }

        List<OrderResponseDto> result = new ArrayList<>();
        for (Orders order : orders) {
            List<OrderItems> orderItems = orderItemRepository.findAllByOrder(order);
            result.add(new OrderResponseDto(order, orderItems));
        }
        return result;
    }

    // 주문 상태 변경
    @Transactional
    public void updateOrderState(Long orderId) {

        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "존재하지 않는 주문입니다."));

        order.setOrderState(true);
        orderRepository.save(order);
    }
    ///  관리자 조회 기능 종료
}

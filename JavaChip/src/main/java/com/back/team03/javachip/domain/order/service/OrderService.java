package com.back.team03.javachip.domain.order.service;

import com.back.team03.javachip.domain.customer.entity.Customers;
import com.back.team03.javachip.domain.customer.repository.CustomerRepository;
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

    //DTO
    public record OrderRequestDto(
            String email,
            String postal_code,
            String detail_address,
            Long product_id,
            Long prod_quantity
    ) {}

    // 응답 DTO
    public record OrderResponseDto(
            Long order_id,
            String email,
            String postal_code,
            String detail_address,
            LocalDateTime order_time,
            Long product_id,
            Long prod_quantity,
            Long prod_price
    ) {
        public OrderResponseDto(Orders order, OrderItems orderItem) {
            this(
                    order.getOrder_id(),
                    order.getCustomers().getEmail(),
                    order.getPostal_code(),
                    order.getDetail_address(),
                    order.getOrder_time(),
                    orderItem.getProduct().getProdId(),
                    orderItem.getProdQuantity(),
                    orderItem.getProdPrice()
            );
        }
    }

    public OrderResponseDto createOrder(OrderRequestDto reqDto){

        Customers customer;
        Optional<Customers> existingCustomer = customerRepository.findByEmail(reqDto.email());

        if(existingCustomer.isPresent()){
            customer = existingCustomer.get();
        }else{
            customer = new Customers();
            customer.setEmail(reqDto.email());
            customerRepository.save(customer);
        }

        Product product;
        Optional<Product> existingProduct = productRepository.findById(reqDto.product_id);
        if(existingProduct.isPresent()){
            product = existingProduct.get();
        }else {
            throw new IllegalArgumentException("존재하지 않는 상품입니다.");
        }

        LocalDateTime start = getOrderStartTime();
        LocalDateTime end = start.plusDays(1);

        Orders order;
        Optional<Orders> existingOrder = orderRepository
                .findByCustomerAndOrderTimeBetween(customer, start, end);

        if(existingOrder.isPresent()){
            order = existingOrder.get();
        }
        else{
            order = new Orders();
            order.setPostal_code(reqDto.postal_code());
            order.setDetail_address(reqDto.detail_address());
            order.setOrder_time(LocalDateTime.now());
            order.setCustomers(customer);
            orderRepository.save(order);
        }

        // 4. OrderItem 저장
        OrderItems orderItem = new OrderItems();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setProdQuantity(reqDto.prod_quantity());
        orderItem.setProdPrice(product.getProdPrice() * reqDto.prod_quantity());
        orderItemRepository.save(orderItem);

        return new OrderResponseDto(order, orderItem);
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

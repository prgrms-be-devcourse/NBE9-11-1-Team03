package com.back.team03.javachip.global.initdata;

import com.back.team03.javachip.domain.customer.entity.Customers;
import com.back.team03.javachip.domain.customer.repository.CustomerRepository;
import com.back.team03.javachip.domain.manager.entity.Manager;
import com.back.team03.javachip.domain.manager.repository.ManagerRepository;
import com.back.team03.javachip.domain.order.entity.OrderItems;
import com.back.team03.javachip.domain.order.entity.Orders;
import com.back.team03.javachip.domain.order.repository.OrderItemRepository;
import com.back.team03.javachip.domain.order.repository.OrderRepository;
import com.back.team03.javachip.domain.product.entity.Product;
import com.back.team03.javachip.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataInit implements ApplicationRunner {

    private final ProductRepository productRepository;
    private final ManagerRepository managerRepository;
    ///  테스트 데이터 생성
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;


    @Override
    public void run(ApplicationArguments args) {

        // 테스트용 관리자 계정 초기 데이터
        if (managerRepository.count() == 0) {
            managerRepository.save(Manager.builder()
                    .adminId("admin")
                    .adminPassword("1234")
                    .build());
        }

        if (productRepository.count() == 0) {
            productRepository.save(Product.builder()
                    .prodName("에티오피아 예가체프")
                    .prodPrice(18000L)
                    .description("과일향이 나는 원두")
                    .build());

            productRepository.save(Product.builder()
                    .prodName("콜롬비아 수프리모")
                    .prodPrice(16000L)
                    .description("균형잡힌 맛의 원두")
                    .build());

            productRepository.save(Product.builder()
                    .prodName("케냐 AA")
                    .prodPrice(20000L)
                    .description("풍부한 바디감의 원두")
                    .build());

            productRepository.save(Product.builder()
                    .prodName("과테말라 안티구아")
                    .prodPrice(15000L)
                    .description("달콤한 향의 원두")
                    .build());
        }

        // 3. 테스트용 주문 초기 데이터 (30개)
        // 기존 주문이 1개라도 있으면 실행 안 되던 문제를 해결하기 위해 < 30 으로 수정
        if (orderRepository.count() < 60) { //60개 이하일 경우
            List<Product> products = productRepository.findAll();
            Random random = new Random();

            // 앞서 조언드린 대로 명시적으로 한국 시간대(Asia/Seoul)를 기준으로 생성합니다.
            LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));

            for (int i = 1; i <= 30; i++) {
                // 고객 5명이 돌아가며 주문한다고 가정
                String email = "user" + (i % 5 + 1) + "@test.com";
                Customers customer = customerRepository.findByEmail(email).orElseGet(() -> {
                    Customers newCustomer = new Customers();
                    newCustomer.setEmail(email);
                    return customerRepository.save(newCustomer);
                });

                // 오후 2시 기준 배송 묶음 테스트를 위해 다양한 시간대 생성
                LocalDateTime orderTime;
                int timeCase = i % 5;
                if (timeCase == 0) {
                    orderTime = now.withHour(10).withMinute(30); // 오늘 오전 10시 30분 (오늘 2시 이전)
                } else if (timeCase == 1) {
                    orderTime = now.withHour(15).withMinute(15); // 오늘 오후 3시 15분 (오늘 2시 이후)
                } else if (timeCase == 2) {
                    orderTime = now.minusDays(1).withHour(11).withMinute(0); // 어제 오전 11시 (어제 2시 이전)
                } else if (timeCase == 3) {
                    orderTime = now.minusDays(1).withHour(16).withMinute(45); // 어제 오후 4시 45분 (어제 2시 이후)
                } else {
                    orderTime = now.minusDays(2).withHour(14).withMinute(30); // 그제 오후 2시 30분
                }

                // 주문(Orders) 생성
                Orders order = Orders.builder()
                        .customers(customer)
                        .postalCode("1234" + (i % 10))
                        .detailAddress("경기도 성남시 분당구 테스트동 " + i + "번길")
                        .orderTime(orderTime)
                        // 3번에 1번 꼴로 주문 완료(true) 처리
                        .isOrderState(i % 3 == 0)
                        .build();
                orderRepository.save(order);

                // 주문 품목(OrderItems) 생성
                // 1~2개의 품목을 랜덤하게 담음
                int itemCount = (i % 2) + 1;
                for (int j = 0; j < itemCount; j++) {
                    Product product = products.get((i + j) % products.size());
                    long quantity = random.nextInt(3) + 1; // 1~3개

                    OrderItems orderItem = new OrderItems();
                    orderItem.setOrder(order);
                    orderItem.setProduct(product);
                    orderItem.setProdQuantity(quantity);
                    orderItem.setProdPrice(product.getProdPrice() * quantity);

                    orderItemRepository.save(orderItem);
                }
            }
        }
    }
}
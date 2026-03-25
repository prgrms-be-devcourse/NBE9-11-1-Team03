package com.back.team03.javachip.global.initdata;

import com.back.team03.javachip.domain.manager.entity.Manager;
import com.back.team03.javachip.domain.manager.repository.ManagerRepository;
import com.back.team03.javachip.domain.product.entity.Product;
import com.back.team03.javachip.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInit implements ApplicationRunner {

    private final ProductRepository productRepository;
    private final ManagerRepository managerRepository;


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
    }
}
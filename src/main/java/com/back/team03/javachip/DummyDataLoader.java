package com.back.team03.javachip;

import com.back.team03.javachip.domain.product.entity.Product;
import com.back.team03.javachip.domain.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class DummyDataLoader {

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository) {
        return args -> {
            productRepository.save(Product.builder()
                    .prodName("맛있는 자바칩 프라푸치노")
                    .prodPrice(6500L)
                    .description("달콤한 초코칩이 씹히는 시그니처 음료")
                    .build());
            System.out.println("✅ 1번 상품(자바칩 프라푸치노)이 DB에 등록되었습니다!");
        };
    }
}
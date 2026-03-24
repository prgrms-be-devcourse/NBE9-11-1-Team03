package com.back.team03.javachip.domain.product.repository;

import com.back.team03.javachip.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
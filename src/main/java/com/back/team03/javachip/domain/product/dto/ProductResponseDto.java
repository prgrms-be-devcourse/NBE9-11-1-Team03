package com.back.team03.javachip.domain.product.dto;

import com.back.team03.javachip.domain.product.entity.Product;
import lombok.Getter;

@Getter
public class ProductResponseDto {
    private Long prodId;
    private String prodName;
    private Long prodPrice;
    private String description;

    public ProductResponseDto(Product product) {
        this.prodId = product.getProdId();
        this.prodName = product.getProdName();
        this.prodPrice = product.getProdPrice();
        this.description = product.getDescription();
    }
}
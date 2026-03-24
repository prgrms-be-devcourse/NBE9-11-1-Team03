package com.back.team03.javachip.domain.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductRequestDto {
    private String prodName;
    private Long prodPrice;
    private String description;
}
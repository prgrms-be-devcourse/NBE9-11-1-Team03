package com.back.team03.javachip.domain.product.service;

import com.back.team03.javachip.domain.product.dto.ProductRequestDto;
import com.back.team03.javachip.domain.product.dto.ProductResponseDto;
import com.back.team03.javachip.domain.product.entity.Product;
import com.back.team03.javachip.domain.product.repository.ProductRepository;
import com.back.team03.javachip.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // 전체 조회
    public List<ProductResponseDto> getAll() {
        return productRepository.findAll()
                .stream()
                .map(ProductResponseDto::new)
                .toList();
    }

    // 단건 조회
    public ProductResponseDto getOne(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "해당 품목이 없습니다. id=" + id));
        return new ProductResponseDto(product);
    }

    // 생성
    public ProductResponseDto create(ProductRequestDto requestDto) {
        if (requestDto.getProdName() == null || requestDto.getProdName().isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "품목 이름을 입력해주세요.");
        }
        if (requestDto.getProdPrice() == null || requestDto.getProdPrice() < 0) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "가격은 0원 이상이어야 합니다.");
        }
        Product product = new Product();
        product.setProdName(requestDto.getProdName());
        product.setProdPrice(requestDto.getProdPrice());
        product.setDescription(requestDto.getDescription());
        return new ProductResponseDto(productRepository.save(product));
    }

    // 수정
    public ProductResponseDto update(Long id, ProductRequestDto requestDto) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "해당 품목이 없습니다. id=" + id));
        if (requestDto.getProdName() == null || requestDto.getProdName().isBlank()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "품목 이름을 입력해주세요.");
        }
        if (requestDto.getProdPrice() == null || requestDto.getProdPrice() < 0) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "가격은 0원 이상이어야 합니다.");
        }
        existing.setProdName(requestDto.getProdName());
        existing.setProdPrice(requestDto.getProdPrice());
        existing.setDescription(requestDto.getDescription());
        return new ProductResponseDto(productRepository.save(existing));
    }

    // 삭제
    public void delete(Long id) {
        productRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "해당 품목이 없습니다. id=" + id));
        productRepository.deleteById(id);
    }
}
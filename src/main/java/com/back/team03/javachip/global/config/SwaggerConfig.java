package com.back.team03.javachip.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Grids & Circles API")
                        .description("원두 패키지 주문 서비스 API 명세서")
                        .version("v1.0.0"));
    }

    @Bean
    public GroupedOpenApi groupApiV1() {
        return GroupedOpenApi.builder()
                .group("apiV1")
                .pathsToMatch("/api/v1/**")
                .build();
    }

    @Bean
    public GroupedOpenApi groupController() {
        return GroupedOpenApi.builder()
                .group("home")
                .pathsToExclude("/api/**")
                .build();
    }
}

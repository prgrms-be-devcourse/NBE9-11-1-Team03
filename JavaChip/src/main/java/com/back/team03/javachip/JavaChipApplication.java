package com.back.team03.javachip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class JavaChipApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaChipApplication.class, args);
    }

}

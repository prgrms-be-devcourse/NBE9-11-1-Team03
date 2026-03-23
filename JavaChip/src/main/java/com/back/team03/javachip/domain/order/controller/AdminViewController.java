package com.back.team03.javachip.domain.order.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller // ⚠️ @RestController 가 아니라 그냥 @Controller 임에 주의하세요! (화면 반환용)
public class AdminViewController {

    /**
     * 브라우저에서 localhost:8080/admin 주소로 접속하면 실행됩니다.
     */
    @GetMapping("/admin")
    public String adminPage() {
        // 💡 스프링에게 "resources/templates/admin/index.html" 파일을 보여주라고 명령합니다!
        return "admin/index";
    }
}
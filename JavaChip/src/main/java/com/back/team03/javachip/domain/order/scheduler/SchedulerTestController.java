package com.back.team03.javachip.domain.order.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/test")
public class SchedulerTestController {

    private final OrderScheduler orderScheduler;

    @PostMapping("/run-scheduler")
    public ResponseEntity<String> runScheduler() {
        orderScheduler.updateOrderState();
        return ResponseEntity.ok("스케줄러 실행 완료!");
    }
}
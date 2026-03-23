package com.back.team03.javachip.domain.manager.repository;

import com.back.team03.javachip.domain.manager.entity.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
    Optional<Manager> findByAdminId(String adminId);
}

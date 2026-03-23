package com.back.team03.javachip.domain.manager.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Manager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long managerId;

    @Column(nullable = false, unique = true)
    private String adminId;

    @Column(nullable = false)
    private String adminPassword;

}

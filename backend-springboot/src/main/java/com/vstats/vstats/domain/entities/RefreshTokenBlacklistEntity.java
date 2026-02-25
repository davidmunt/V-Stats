package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "refresh_token_blacklist")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenBlacklistEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_blacklist")
    private Long idBlacklist;

    @Column(name = "id_user", nullable = false)
    private Long idUser;

    @Column(name = "user_type", nullable = false)
    private String userType;

    @Column(nullable = false)
    private String token;

    @Column(name = "blacklisted_at")
    private LocalDateTime blacklistedAt;

    private String reason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "boxed_at")
    private LocalDateTime boxedAt;
}
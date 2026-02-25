package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_refresh_token")
    private Long idRefreshToken;

    @Column(name = "id_user", nullable = false)
    private Long idUser;

    @Column(name = "user_type", nullable = false)
    private String userType;

    @Column(nullable = false, unique = true)
    private String hashedToken;

    @Column(name = "id_family", nullable = false)
    private java.util.UUID idFamily;

    @Column(name = "id_device")
    private String idDevice;

    @Column(name = "session_version", nullable = false)
    private Integer sessionVersion;

    @Builder.Default
    private boolean revoked = false;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "boxed_at")
    private LocalDateTime boxedAt;
}
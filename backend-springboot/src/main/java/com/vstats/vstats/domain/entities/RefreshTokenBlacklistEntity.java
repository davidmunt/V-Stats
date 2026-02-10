package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user", nullable = false)
    private LeagueAdminEntity user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "blacklisted_at")
    private LocalDateTime blacklistedAt;

    private String reason;
}
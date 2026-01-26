package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "lineup_positions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LineupPositionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_lineup_position")
    private Long idLineupPosition;

    @Column(nullable = false, unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_lineup", nullable = false)
    private LineupEntity lineup;

    @Column(name = "id_player", nullable = false)
    private String idPlayer; // Formato String

    @Column(name = "is_on_court")
    private Boolean isOnCourt;

    @Column(name = "initial_position")
    private Integer initialPosition; // 1 a 6 (7 para líbero/inicio)

    @Column(name = "current_position")
    private Integer currentPosition;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Builder.Default
    private String status = "active";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "boxed_at")
    private LocalDateTime boxedAt;
}
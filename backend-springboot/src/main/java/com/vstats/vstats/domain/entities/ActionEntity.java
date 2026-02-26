package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "actions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_action")
    private Long idAction;

    @Column(nullable = false, unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_match", nullable = false)
    private MatchEntity match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_set", nullable = false)
    private SetEntity set;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_team", nullable = false)
    private TeamEntity team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_player", nullable = true)
    private PlayerEntity player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_point_for_team")
    private TeamEntity pointForTeam;

    @Column(name = "player_position")
    private Integer playerPosition; // 1-6

    @Column(name = "action_type", nullable = false)
    private String actionType;

    @Column(nullable = false)
    private String result;

    @Column(name = "start_x")
    private Integer startX;

    @Column(name = "start_y")
    private Integer startY;

    @Column(name = "end_x")
    private Integer endX;

    @Column(name = "end_y")
    private Integer endY;

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
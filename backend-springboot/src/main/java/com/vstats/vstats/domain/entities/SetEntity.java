package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "sets")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_set")
    private Long idSet;

    @Column(nullable = false, unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_match", nullable = false)
    private MatchEntity match;

    @Column(name = "set_number", nullable = false)
    private Integer setNumber;

    @Column(name = "local_points")
    @Builder.Default
    private Integer localPoints = 0;

    @Column(name = "visitor_points")
    @Builder.Default
    private Integer visitorPoints = 0;

    @Column(name = "finished_at")
    private LocalDateTime finishedAt;

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
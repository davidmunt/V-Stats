package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "season_leagues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeasonLeagueEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSeasonLeague;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_league", nullable = false)
    private LeagueEntity league;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_season", nullable = false)
    private SeasonEntity season;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_category", nullable = false)
    private CategoryEntity category;

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
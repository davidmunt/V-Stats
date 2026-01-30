package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_seasons")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SeasonTeamEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTeamSeason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_team", nullable = false)
    private TeamEntity team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_season", nullable = false)
    private SeasonEntity season;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_league", nullable = false)
    private LeagueEntity league;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_venue")
    private VenueEntity venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_coach")
    private CoachEntity coach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_analyst")
    private AnalystEntity analyst;

    @Builder.Default
    private String status = "active";

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
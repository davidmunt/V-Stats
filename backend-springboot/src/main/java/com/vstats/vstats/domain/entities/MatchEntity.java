package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_match")
    private Long idMatch;

    @Column(nullable = false, unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_league", nullable = false)
    private LeagueEntity league;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_local_team", nullable = false)
    private TeamEntity localTeam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_visitor_team", nullable = false)
    private TeamEntity visitorTeam;

    @Column(name = "id_venue")
    private String idVenue; 

    @Column(name = "id_admin_creator", nullable = false)
    private String idAdminCreator;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(name = "current_set")
    @Builder.Default
    private Integer currentSet = 1;

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Builder.Default
    private String status = "scheduled";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "boxed_at")
    private LocalDateTime boxedAt;
}
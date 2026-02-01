package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "season_players")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SeasonPlayerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSeasonPlayer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_player", nullable = false)
    private PlayerEntity player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_season_team", nullable = false)
    private SeasonTeamEntity seasonTeam; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_season", nullable = false)
    private SeasonEntity season;

    private Integer dorsal;
    private String role; 

    @Builder.Default
    private String status = "active";

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;
}
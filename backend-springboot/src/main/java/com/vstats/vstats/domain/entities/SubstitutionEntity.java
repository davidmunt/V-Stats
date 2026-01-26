package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "substitutions")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubstitutionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_substitution")
    private Long idSubstitution;

    @Column(nullable = false, unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_match", nullable = false)
    private MatchEntity match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_set", nullable = false)
    private SetEntity set;

    @Column(name = "id_team", nullable = false)
    private String idTeam; // Formato String

    @Column(name = "id_other_player")
    private String idOtherPlayer; // Jugador normal (sustituido o sustituto)

    @Column(name = "id_libero_player")
    private String idLiberoPlayer; // ID del líbero involucrado

    @Column(name = "libero_is_replacing")
    private Boolean liberoIsReplacing; // true si el líbero entra, false si sale

    @Column(nullable = false)
    private Integer position; // 1 a 6

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
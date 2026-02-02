package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.MatchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<MatchEntity, Long> {
    Optional<MatchEntity> findBySlug(String slug);
    
    // Partidos de una liga en la temporada activa
    List<MatchEntity> findAllByLeague_SlugAndIsActiveTrue(String leagueSlug);
    
    // Partidos donde participa un equipo (como local o visitante)
    List<MatchEntity> findAllByLocalTeam_SlugOrVisitorTeam_Slug(String localSlug, String visitorSlug);

    // Buscar partidos donde el equipo sea local o visitante
    List<MatchEntity> findAllByLocalTeam_IdTeamOrVisitorTeam_IdTeam(Long localId, Long visitorId);
}
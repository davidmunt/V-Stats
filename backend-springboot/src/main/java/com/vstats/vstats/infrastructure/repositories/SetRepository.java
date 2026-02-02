package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.MatchEntity;
import com.vstats.vstats.domain.entities.SetEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SetRepository extends JpaRepository<SetEntity, Long> {

    // Buscar partidos donde el equipo sea local o visitante
    List<MatchEntity> findAllByLocalTeam_IdTeamOrVisitorTeam_IdTeam(Long localId, Long visitorId);

    // Buscar el set específico de un partido
    Optional<SetEntity> findByMatch_SlugAndSetNumber(String matchSlug, Integer setNumber);
}
package com.vstats.vstats.infrastructure.specs;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.vstats.vstats.domain.entities.SeasonLeagueEntity;

import jakarta.persistence.criteria.Predicate;

public class LeagueSpecification {
    public static Specification<SeasonLeagueEntity> filterLeagues(String q) {
        return (root, query, cb) -> {
            // 'root' es la tabla (SeasonLeagueEntity)
            // 'cb' (CriteriaBuilder) es el que tiene las funciones: like, equal, and, or...
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("season").get("isActive"), true));
            predicates.add(cb.notEqual(root.get("status"), "deleted"));
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.toLowerCase() + "%";
                // Buscamos en sl.league.name
                predicates.add(cb.like(cb.lower(root.get("league").get("name")), pattern));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
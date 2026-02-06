package com.vstats.vstats.infrastructure.specs;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.vstats.vstats.domain.entities.SeasonPlayerEntity;

import jakarta.persistence.criteria.Predicate;

public class PlayerSpecification {
    public static Specification<SeasonPlayerEntity> filterPlayers(String slugTeam, String q) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("seasonTeam").get("team").get("slug"), slugTeam));
            predicates.add(cb.equal(root.get("season").get("isActive"), true));
            predicates.add(cb.notEqual(root.get("status"), "deleted"));
            
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("player").get("name")), pattern));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
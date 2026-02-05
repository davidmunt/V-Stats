package com.vstats.vstats.infrastructure.specs;

import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import com.vstats.vstats.domain.entities.VenueEntity;
import jakarta.persistence.criteria.Predicate;

public class VenueSpecification {
    public static Specification<VenueEntity> filterBy(String q) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.notEqual(root.get("status"), "deleted"));

            if (q != null && !q.isBlank()) {
                String likePattern = "%" + q.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("name")), likePattern));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
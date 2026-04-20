package com.vstats.vstats.infrastructure.specs;

import org.springframework.data.jpa.domain.Specification;
import com.vstats.vstats.domain.entities.VenueEntity;

public class VenueSpecification {

    public static Specification<VenueEntity> build(String q, String status) {
        return Specification
                .where(isAvailable())
                .and(searchByQ(q))
                .and(filterByStatus(status));
    }

    private static Specification<VenueEntity> isAvailable() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), "deleted");
    }

    private static Specification<VenueEntity> searchByQ(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank())
                return null;
            String pattern = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("slug")), pattern));
        };
    }

    private static Specification<VenueEntity> filterByStatus(String status) {
        return (root, query, cb) -> (status == null || status.isBlank())
                ? null
                : cb.equal(root.get("status"), status.toLowerCase());
    }
}
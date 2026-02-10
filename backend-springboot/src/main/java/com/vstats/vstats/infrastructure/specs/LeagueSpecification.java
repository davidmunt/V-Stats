package com.vstats.vstats.infrastructure.specs;

import org.springframework.data.jpa.domain.Specification;
import com.vstats.vstats.domain.entities.SeasonLeagueEntity;

public class LeagueSpecification {

    public static Specification<SeasonLeagueEntity> build(String q, String categorySlug, String status) {
        return Specification
                .where(isAvailable()) // Siempre activo y no borrado
                .and(searchByQ(q))
                .and(filterByCategory(categorySlug))
                .and(filterByStatus(status));
    }

    private static Specification<SeasonLeagueEntity> isAvailable() {
        return (root, query, cb) -> cb.and(
                cb.equal(root.get("season").get("isActive"), true),
                cb.notEqual(root.get("status"), "deleted"));
    }

    private static Specification<SeasonLeagueEntity> searchByQ(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank())
                return null;
            String pattern = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("league").get("name")), pattern),
                    cb.like(cb.lower(root.get("league").get("slug")), pattern));
        };
    }

    private static Specification<SeasonLeagueEntity> filterByCategory(String slug) {
        return (root, query, cb) -> (slug == null || slug.isBlank())
                ? null
                : cb.equal(root.get("league").get("category").get("slug"), slug);
    }

    private static Specification<SeasonLeagueEntity> filterByStatus(String status) {
        return (root, query, cb) -> (status == null || status.isBlank())
                ? null
                : cb.equal(root.get("status"), status.toLowerCase());
    }
}
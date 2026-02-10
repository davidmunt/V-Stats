package com.vstats.vstats.infrastructure.specs;

import org.springframework.data.jpa.domain.Specification;
import com.vstats.vstats.domain.entities.SeasonPlayerEntity;

public class PlayerSpecification {

    public static Specification<SeasonPlayerEntity> build(String q, Long idTeam, String status) {
        return Specification
                .where(isAvailable())
                .and(isCurrentSeason())
                .and(searchByQ(q))
                .and(filterByTeam(idTeam))
                .and(filterByStatus(status));
    }

    private static Specification<SeasonPlayerEntity> isCurrentSeason() {
        return (root, query, cb) -> cb.equal(root.get("season").get("isActive"), true);
    }

    private static Specification<SeasonPlayerEntity> isAvailable() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), "deleted");
    }

    private static Specification<SeasonPlayerEntity> searchByQ(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank())
                return null;
            String pattern = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("player").get("name")), pattern),
                    cb.like(cb.lower(root.get("player").get("slug")), pattern));
        };
    }

    private static Specification<SeasonPlayerEntity> filterByTeam(Long idTeam) {
        return (root, query, cb) -> {
            if (idTeam == null)
                return null;
            return cb.equal(root.get("seasonTeam").get("team").get("idTeam"), idTeam);
        };
    }

    private static Specification<SeasonPlayerEntity> filterByStatus(String status) {
        return (root, query, cb) -> (status == null || status.isBlank())
                ? null
                : cb.equal(root.get("status"), status.toLowerCase());
    }
}
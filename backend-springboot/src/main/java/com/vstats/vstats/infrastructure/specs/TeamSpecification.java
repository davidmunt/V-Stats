package com.vstats.vstats.infrastructure.specs;

import org.springframework.data.jpa.domain.Specification;
import com.vstats.vstats.domain.entities.SeasonTeamEntity;

public class TeamSpecification {

    public static Specification<SeasonTeamEntity> build(String q, Long idLeague, String status) {
        return Specification
                .where(isAvailable())
                .and(isCurrentSeason())
                .and(searchByQ(q))
                .and(filterByLeague(idLeague))
                .and(filterByStatus(status));
    }

    private static Specification<SeasonTeamEntity> isCurrentSeason() {
        return (root, query, cb) -> cb.equal(root.get("season").get("isActive"), true);
    }

    private static Specification<SeasonTeamEntity> isAvailable() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), "deleted");
    }

    private static Specification<SeasonTeamEntity> searchByQ(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank())
                return null;
            String pattern = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("team").get("name")), pattern),
                    cb.like(cb.lower(root.get("team").get("slug")), pattern));
        };
    }

    private static Specification<SeasonTeamEntity> filterByLeague(Long idLeague) {
        return (root, query, cb) -> idLeague == null
                ? null
                : cb.equal(root.get("league").get("idLeague"), idLeague);
    }

    private static Specification<SeasonTeamEntity> filterByStatus(String status) {
        return (root, query, cb) -> (status == null || status.isBlank())
                ? null
                : cb.equal(root.get("status"), status.toLowerCase());
    }
}
package com.vstats.vstats.infrastructure.specs;

import org.springframework.data.jpa.domain.Specification;

import com.vstats.vstats.domain.entities.CategoryEntity;

public class CategorySpecification {

    public static Specification<CategoryEntity> build(String q, String status) {
        return Specification
                .where(isAvailable())
                .and(searchByQ(q))
                .and(filterByStatus(status));
    }

    private static Specification<CategoryEntity> isAvailable() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), "deleted");
    }

    private static Specification<CategoryEntity> searchByQ(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank())
                return null;
            String pattern = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("slug")), pattern));
        };
    }

    private static Specification<CategoryEntity> filterByStatus(String status) {
        return (root, query, cb) -> (status == null || status.isBlank())
                ? null
                : cb.equal(root.get("status"), status.toLowerCase());
    }
}
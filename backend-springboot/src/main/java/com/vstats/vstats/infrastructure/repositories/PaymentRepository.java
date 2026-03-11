package com.vstats.vstats.infrastructure.repositories;

import com.vstats.vstats.domain.entities.PaymentEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
}

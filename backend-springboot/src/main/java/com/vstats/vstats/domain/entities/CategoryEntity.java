package com.vstats.vstats.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "categories") // Nombre de la tabla en Postgres (mejor en plural y minúsculas)
@Getter @Setter // Lombok: Genera los get y set automáticamente
@NoArgsConstructor // Lombok: Constructor vacío (necesario para JPA)
@AllArgsConstructor // Lombok: Constructor con todos los argumentos
@Builder // Lombok: Patrón Builder para crear objetos fácilmente
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "admin_id", nullable = false)
    private Long adminId;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    private String image;

    @Column(name = "is_active")
    private Boolean isActive = true;

    private String status = "active";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

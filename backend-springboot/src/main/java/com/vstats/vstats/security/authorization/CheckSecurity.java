package com.vstats.vstats.security.authorization;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public @interface CheckSecurity {

    // Para cualquier usuario logueado (independientemente del rol)
    public @interface Protected {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("isAuthenticated()")
        public @interface CanManage {
        }
    }

    // Reglas específicas para Ligas
    public @interface Leagues {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        // Solo el Admin de la liga puede gestionar
        @PreAuthorize("@authZ.isLeagueAdmin(#slug)")
        public @interface CanManage {
        }

        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("hasRole('admin')")
        public @interface CanCreate {
        }
    }

    // Reglas para Equipos (Basado en si eres Coach)
    public @interface Teams {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("hasRole('coach')")
        public @interface CanManage {
        }
    }

    // Reglas para Acciones (Basado en si eres Analista)
    public @interface Actions {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("hasRole('analyst')")
        public @interface CanManage {
        }
    }

    // Reglas para Sedes
    public @interface Venues {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("@authZ.isVenueAdmin(#slug)")
        public @interface CanManage {
        }
    }
}
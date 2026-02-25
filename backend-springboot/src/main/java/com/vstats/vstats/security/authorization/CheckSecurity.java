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

    public @interface Leagues {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("@authZ.isLeagueAdmin(#slug)")
        public @interface CanManage {
        }

        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("hasRole('admin')")
        public @interface CanCreate {
        }
    }

    public @interface Teams {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("@authZ.isTeamAdmin(#slug)")
        public @interface CanManage {
        }
    }

    public @interface Matches {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("@authZ.isMatchAdmin(#slug)")
        public @interface CanManage {
        }
    }

    public @interface Players {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("@authZ.isTeamCoach(#request.slug_team)")
        public @interface CanCreate {
        }

        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("@authZ.isPlayerCoach(#slug)")
        public @interface CanManage {
        }
    }

    public @interface Venues {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("@authZ.isVenueAdmin(#slug)")
        public @interface CanManage {
        }
    }

    public @interface Categories {
        @Retention(RetentionPolicy.RUNTIME)
        @Target(ElementType.METHOD)
        @PreAuthorize("@authZ.isCategoryAdmin(#slug)")
        public @interface CanManage {
        }
    }
}
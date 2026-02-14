package com.vstats.vstats.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthUtils {

    private Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public boolean isAuthenticated() {
        Authentication auth = getAuthentication();
        return auth != null && auth.isAuthenticated()
                && !(auth instanceof org.springframework.security.authentication.AnonymousAuthenticationToken);
    }

    public String getCurrentUserEmail() {
        return getAuthentication().getName();
    }

    public String getCurrentToken() {
        var authHeader = org.springframework.web.context.request.RequestContextHolder
                .getRequestAttributes() != null
                        ? ((org.springframework.web.context.request.ServletRequestAttributes) org.springframework.web.context.request.RequestContextHolder
                                .getRequestAttributes())
                                .getRequest().getHeader(org.springframework.http.HttpHeaders.AUTHORIZATION)
                        : null;

        if (authHeader != null && authHeader.startsWith("Token ")) {
            return authHeader.substring(6);
        }
        return null;
    }

    public Long getCurrentUserId() {
        Object principal = getAuthentication().getPrincipal();
        if (principal instanceof AuthenticatedUser) {
            return ((AuthenticatedUser) principal).getId();
        }
        return null;
    }

    public String getCurrentUserRole() {
        Object principal = getAuthentication().getPrincipal();
        if (principal instanceof AuthenticatedUser) {
            return ((AuthenticatedUser) principal).getRole();
        }
        return null;
    }
}
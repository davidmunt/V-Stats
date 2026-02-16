package com.vstats.vstats.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;

@Getter
public class AuthenticatedUser implements UserDetails {
    private final Long id;
    private final String email;
    private final String password;
    private final String role;
    private final Object entity;

    public AuthenticatedUser(Long id, String email, String password, String role, Object entity) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.entity = entity;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Si quieres usar minúsculas, asegúrate de que el prefijo sea ROLE_
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.toLowerCase()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
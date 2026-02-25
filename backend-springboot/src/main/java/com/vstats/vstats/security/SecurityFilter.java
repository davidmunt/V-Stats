package com.vstats.vstats.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);
        final String email = tokenService.extractEmail(token);

        if (email != null && !isAuthenticated()) {
            try {
                // 1. Cargamos el UserDetails y lo casteamos a tu clase AuthenticatedUser
                // para poder acceder al método getSessionVersion()
                var userDetails = (AuthenticatedUser) userDetailsService.loadUserByUsername(email);

                // 2. Extraemos la versión de la sesión guardada DENTRO del JWT
                Integer tokenVersion = tokenService.extractClaim(token,
                        claims -> claims.get("session_version", Integer.class));

                // 3. Verificamos:
                // - Que el token sea válido (firma y tiempo)
                // - Que la versión del token coincida con la de la base de datos
                if (tokenService.isTokenValid(token, userDetails.getUsername()) &&
                        tokenVersion != null &&
                        tokenVersion.equals(userDetails.getSessionVersion())) {

                    var authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Si el usuario no existe o el casteo falla, simplemente no autenticamos.
                // Spring Security devolverá 403 o 401 según tu configuración.
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isAuthenticated() {
        return SecurityContextHolder.getContext().getAuthentication() != null;
    }
}
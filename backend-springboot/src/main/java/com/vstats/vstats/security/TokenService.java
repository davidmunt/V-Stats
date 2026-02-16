package com.vstats.vstats.security;

import com.vstats.vstats.infrastructure.repositories.AnalystRepository;
import com.vstats.vstats.infrastructure.repositories.CoachRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.infrastructure.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final AuthProperties properties;

    private final LeagueAdminRepository adminRepo;
    private final CoachRepository coachRepo;
    private final AnalystRepository analystRepo;
    private final UserRepository userRepo;

    public String generateToken(String subject, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role.toLowerCase()); // Lo forzamos a minúsculas
        return buildToken(claims, subject);
    }

    private String buildToken(Map<String, Object> extraClaims, String subject) {
        var nowMillis = System.currentTimeMillis();

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuer("vstats-api")
                .setIssuedAt(new Date(nowMillis))
                .setExpiration(new Date(nowMillis + properties.getToken().getExpiration()))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, String subject) {
        boolean userExists = adminRepo.findByEmail(subject).isPresent() ||
                coachRepo.findByEmail(subject).isPresent() ||
                analystRepo.findByEmail(subject).isPresent() ||
                userRepo.findByEmail(subject).isPresent();

        if (!userExists) {
            return false;
        }

        final String email = extractEmail(token);
        return email.equals(subject) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (RuntimeException e) {
            return true;
        }
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException ex) {
            throw new RuntimeException("Token expired");
        } catch (Exception ex) {
            throw new RuntimeException("Token invalid");
        }
    }

    private Key getKey() {
        byte[] bytes = Decoders.BASE64.decode(properties.getToken().getSecret());
        return Keys.hmacShaKeyFor(bytes);
    }
}
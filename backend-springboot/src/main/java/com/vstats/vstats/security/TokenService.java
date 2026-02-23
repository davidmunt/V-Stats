package com.vstats.vstats.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.vstats.vstats.infrastructure.repositories.AnalystRepository;
import com.vstats.vstats.infrastructure.repositories.CoachRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.infrastructure.repositories.UserRepository;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final AuthProperties properties;
    private final LeagueAdminRepository adminRepo;
    private final CoachRepository coachRepo;
    private final AnalystRepository analystRepo;
    private final UserRepository userRepo;

    public String generateAccessToken(String email, String role) {
        long expiration = switch (role.toLowerCase()) {
            case "admin" -> properties.getToken().getExpiration().getAdmin();
            case "coach", "analyst" -> properties.getToken().getExpiration().getStaff();
            default -> properties.getToken().getExpiration().getUser();
        };

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role.toLowerCase());
        claims.put("type", "access");

        return buildToken(claims, email, expiration);
    }

    public String generateRefreshToken(String email, String role) {
        long expiration = switch (role.toLowerCase()) {
            case "admin" -> properties.getRefresh().getExpiration().getAdmin();
            case "coach", "analyst" -> properties.getRefresh().getExpiration().getStaff();
            default -> properties.getRefresh().getExpiration().getUser();
        };

        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        claims.put("jti", UUID.randomUUID().toString());

        return buildToken(claims, email, expiration);
    }

    private String buildToken(Map<String, Object> extraClaims, String subject, long expirationMillis) {
        var nowMillis = System.currentTimeMillis();

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuer("vstats-api")
                .setIssuedAt(new Date(nowMillis))
                .setExpiration(new Date(nowMillis + expirationMillis))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al inicializar el algoritmo de hashing", e);
        }
    }

    public boolean verifyTokenHash(String plainToken, String hashedTokenInDb) {
        String hashedInput = hashToken(plainToken);
        return hashedInput.equals(hashedTokenInDb);
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
            return ex.getClaims();
        } catch (Exception ex) {
            throw new RuntimeException("Token invalid");
        }
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
            Jwts.parserBuilder()
                    .setSigningKey(getKey())
                    .build()
                    .parseClaimsJws(token);
            return false;
        } catch (ExpiredJwtException e) {
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    private Key getKey() {
        byte[] bytes = Decoders.BASE64.decode(properties.getToken().getSecret());
        return Keys.hmacShaKeyFor(bytes);
    }
}
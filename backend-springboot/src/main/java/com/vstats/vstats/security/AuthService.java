package com.vstats.vstats.security;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import com.vstats.vstats.domain.entities.AnalystEntity;
import com.vstats.vstats.domain.entities.CoachEntity;
import com.vstats.vstats.domain.entities.LeagueAdminEntity;
import com.vstats.vstats.domain.entities.RefreshTokenEntity;
import com.vstats.vstats.domain.entities.UserEntity;
import com.vstats.vstats.infrastructure.repositories.AnalystRepository;
import com.vstats.vstats.infrastructure.repositories.CoachRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.infrastructure.repositories.PlayerRepository;
import com.vstats.vstats.infrastructure.repositories.RefreshTokenRepository;
import com.vstats.vstats.infrastructure.repositories.UserRepository;
import com.vstats.vstats.presentation.requests.auth.LoginUserRequest;
import com.vstats.vstats.presentation.requests.auth.RegisterUserRequest;
import com.vstats.vstats.presentation.responses.UserResponse;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final LeagueAdminRepository adminRepo;
    private final CoachRepository coachRepo;
    private final AnalystRepository analystRepo;
    private final UserRepository userRepo;
    private final PlayerRepository playerRepo;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthProperties properties;

    @Transactional
    public UserResponse register(RegisterUserRequest request, String userAgent, HttpServletResponse response) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre es obligatorio.");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo electrónico es obligatorio.");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria.");
        }
        if (request.getUser_type() == null || request.getUser_type().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El tipo de usuario es obligatorio.");
        }
        if (request.getPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La contraseña debe tener al menos 6 caracteres.");
        }

        Boolean emailExists = switch (request.getUser_type().toLowerCase()) {
            case "admin" -> adminRepo.existsByEmail(request.getEmail());
            case "coach" -> coachRepo.existsByEmail(request.getEmail());
            case "analyst" -> analystRepo.existsByEmail(request.getEmail());
            default -> userRepo.existsByEmail(request.getEmail());
        };
        if (emailExists) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El correo ya está en uso por otro usuario.");
        }
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        String slug = generateUniqueSlug(request.getName());
        String type = request.getUser_type().toLowerCase();

        String accessToken = tokenService.generateAccessToken(request.getEmail(), type);
        String refreshToken = tokenService.generateRefreshToken(request.getEmail(), type);

        var hashedRefreshToken = tokenService.hashToken(refreshToken);
        UUID familyId = UUID.randomUUID();
        long refreshExpMillis = getRefreshExpByRole(type);

        Object savedEntity = switch (type) {
            case "admin" -> adminRepo.save(LeagueAdminEntity.builder()
                    .name(request.getName()).email(request.getEmail())
                    .password(encodedPassword).slug(slug).status("active").build());
            case "coach" -> coachRepo.save(CoachEntity.builder()
                    .name(request.getName()).email(request.getEmail())
                    .password(encodedPassword).slug(slug).status("active").build());
            case "analyst" -> analystRepo.save(AnalystEntity.builder()
                    .name(request.getName()).email(request.getEmail())
                    .password(encodedPassword).slug(slug).status("active").build());
            default -> userRepo.save(UserEntity.builder()
                    .name(request.getName()).email(request.getEmail())
                    .password(encodedPassword).slug(slug).status("active").build());
        };

        RefreshTokenEntity session = RefreshTokenEntity.builder()
                .idUser(getEntityId(savedEntity))
                .userType(type.toUpperCase())
                .hashedToken(hashedRefreshToken)
                .idFamily(familyId)
                .idDevice(userAgent)
                .sessionVersion(0)
                .revoked(false)
                .expiresAt(LocalDateTime.now().plusNanos(java.time.Duration.ofMillis(refreshExpMillis).toNanos()))
                .build();
        refreshTokenRepository.save(session);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(refreshExpMillis / 1000)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return mapToResponse(savedEntity, type, accessToken);
    }

    @Transactional
    public UserResponse login(LoginUserRequest request, String userAgent, HttpServletResponse response) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo electrónico es obligatorio.");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria.");
        }
        if (request.getPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La contraseña debe tener al menos 6 caracteres.");
        }
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        AuthenticatedUser userDetails = (AuthenticatedUser) auth.getPrincipal();
        String type = userDetails.getRole().toLowerCase();

        String accessToken = tokenService.generateAccessToken(userDetails.getEmail(), type);
        String refreshToken = tokenService.generateRefreshToken(userDetails.getEmail(), type);

        var hashedRefreshToken = tokenService.hashToken(refreshToken);

        UUID familyId = UUID.randomUUID();

        long refreshExpMillis = getRefreshExpByRole(type);

        RefreshTokenEntity session = RefreshTokenEntity.builder()
                .idUser(userDetails.getId())
                .userType(type.toUpperCase())
                .hashedToken(hashedRefreshToken)
                .idFamily(familyId)
                .idDevice(userAgent)
                .sessionVersion(userDetails.getSessionVersion())
                .revoked(false)
                .expiresAt(LocalDateTime.now().plusNanos(java.time.Duration.ofMillis(refreshExpMillis).toNanos()))
                .build();

        refreshTokenRepository.save(session);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(refreshExpMillis / 1000)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return mapToResponse(userDetails.getEntity(), type, accessToken);
    }

    private UserResponse mapToResponse(Object entity, String type, String token) {
        String name = "";
        String email = "";
        String avatar = "";
        String slug = "";

        if (entity instanceof LeagueAdminEntity e) {
            name = e.getName();
            email = e.getEmail();
            avatar = e.getAvatar();
            slug = e.getSlug();
        } else if (entity instanceof CoachEntity e) {
            name = e.getName();
            email = e.getEmail();
            avatar = e.getAvatar();
            slug = e.getSlug();
        } else if (entity instanceof AnalystEntity e) {
            name = e.getName();
            email = e.getEmail();
            avatar = e.getAvatar();
            slug = e.getSlug();
        } else if (entity instanceof UserEntity e) {
            name = e.getName();
            email = e.getEmail();
            avatar = e.getAvatar();
            slug = e.getSlug();
        }

        return UserResponse.builder()
                .name(name)
                .email(email)
                .slug_user(slug)
                .user_type(type)
                .avatar(avatar)
                .token(token)
                .build();
    }

    private String generateUniqueSlug(String name) {
        String baseSlug = name.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");

        String finalSlug = baseSlug;
        int count = 1;

        while (existsInAnyTable(finalSlug)) {
            finalSlug = baseSlug + "-" + count;
            count++;
        }

        return finalSlug;
    }

    private long getRefreshExpByRole(String role) {
        return switch (role.toLowerCase()) {
            case "admin" -> properties.getRefresh().getExpiration().getAdmin();
            case "coach", "analyst" -> properties.getRefresh().getExpiration().getStaff();
            default -> properties.getRefresh().getExpiration().getUser();
        };
    }

    private Long getEntityId(Object entity) {
        if (entity instanceof LeagueAdminEntity e)
            return e.getIdAdmin();
        if (entity instanceof CoachEntity e)
            return e.getIdCoach();
        if (entity instanceof AnalystEntity e)
            return e.getIdAnalyst();
        if (entity instanceof AnalystEntity e)
            return e.getIdAnalyst();
        if (entity instanceof UserEntity e)
            return e.getIdUser();
        return null;
    }

    private boolean existsInAnyTable(String slug) {
        return adminRepo.existsBySlug(slug) ||
                coachRepo.existsBySlug(slug) ||
                analystRepo.existsBySlug(slug) ||
                userRepo.existsBySlug(slug) ||
                playerRepo.existsBySlug(slug);
    }
}
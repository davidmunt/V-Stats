package com.vstats.vstats.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vstats.vstats.domain.entities.AnalystEntity;
import com.vstats.vstats.domain.entities.CoachEntity;
import com.vstats.vstats.domain.entities.LeagueAdminEntity;
import com.vstats.vstats.domain.entities.UserEntity;
import com.vstats.vstats.infrastructure.repositories.AnalystRepository;
import com.vstats.vstats.infrastructure.repositories.CoachRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.infrastructure.repositories.PlayerRepository;
import com.vstats.vstats.infrastructure.repositories.UserRepository;
import com.vstats.vstats.presentation.requests.auth.LoginUserRequest;
import com.vstats.vstats.presentation.requests.auth.RegisterUserRequest;
import com.vstats.vstats.presentation.responses.UserResponse;

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

    public UserResponse register(RegisterUserRequest request) {
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        String slug = generateUniqueSlug(request.getName());
        String type = request.getUser_type().toLowerCase();

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

        String token = tokenService.generateToken(request.getEmail(), type);
        return mapToResponse(savedEntity, type, token);
    }

    public UserResponse authenticate(LoginUserRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        AuthenticatedUser userDetails = (AuthenticatedUser) auth.getPrincipal();

        String token = tokenService.generateToken(userDetails.getEmail(), userDetails.getRole());

        return mapToResponse(userDetails.getEntity(), userDetails.getRole(), token);
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

    private boolean existsInAnyTable(String slug) {
        return adminRepo.existsBySlug(slug) ||
                coachRepo.existsBySlug(slug) ||
                analystRepo.existsBySlug(slug) ||
                userRepo.existsBySlug(slug) ||
                playerRepo.existsBySlug(slug);
    }
}
package com.vstats.vstats.application.services;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.vstats.vstats.domain.entities.AnalystEntity;
import com.vstats.vstats.domain.entities.CoachEntity;
import com.vstats.vstats.domain.entities.LeagueAdminEntity;
import com.vstats.vstats.domain.entities.UserEntity;
import com.vstats.vstats.infrastructure.repositories.AnalystRepository;
import com.vstats.vstats.infrastructure.repositories.CoachRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.infrastructure.repositories.UserRepository;
import com.vstats.vstats.presentation.requests.auth.UpdatePasswordRequest;
import com.vstats.vstats.presentation.requests.auth.UpdateUserRequest;
import com.vstats.vstats.presentation.responses.AnalystResponse;
import com.vstats.vstats.presentation.responses.CoachResponse;
import com.vstats.vstats.presentation.responses.UserResponse;
import com.vstats.vstats.security.AuthUtils;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthUtils authUtils;
    private final PasswordEncoder passwordEncoder;

    private final LeagueAdminRepository adminRepo;
    private final CoachRepository coachRepo;
    private final AnalystRepository analystRepo;
    private final UserRepository userRepo;

    public UserResponse getCurrentUser() {
        Long id = authUtils.getCurrentUserId();
        String role = authUtils.getCurrentUserRole();
        String token = authUtils.getCurrentToken();

        Object entity = switch (role) {
            case "admin" -> adminRepo.findById(id).orElseThrow();
            case "coach" -> coachRepo.findById(id).orElseThrow();
            case "analyst" -> analystRepo.findById(id).orElseThrow();
            default -> userRepo.findById(id).orElseThrow();
        };

        return mapToResponse(entity, role, token);
    }

    public List<CoachResponse> getFreeCoaches() {
        String role = authUtils.getCurrentUserRole();

        if (!role.equals("admin"))
            throw new SecurityException("Only admins can access this resource");

        List<CoachEntity> entities = coachRepo.findAllByTeamIsNull();
        return entities.stream()
                .map(this::mapToCoachResponse)
                .toList();
    }

    public List<AnalystResponse> getFreeAnalysts() {
        String role = authUtils.getCurrentUserRole();

        if (!role.equals("admin"))
            throw new SecurityException("Only admins can access this resource");

        List<AnalystEntity> entities = analystRepo.findAllByTeamIsNull();
        return entities.stream()
                .map(this::mapToAnalystResponse)
                .toList();
    }

    public List<CoachResponse> getAssignedCoaches() {
        String role = authUtils.getCurrentUserRole();

        if (!role.equals("admin"))
            throw new SecurityException("Only admins can access this resource");

        List<CoachEntity> entities = coachRepo.findAllByTeamIsNotNull();
        return entities.stream()
                .map(this::mapToCoachResponse)
                .toList();
    }

    public List<AnalystResponse> getAssignedAnalysts() {
        String role = authUtils.getCurrentUserRole();

        if (!role.equals("admin"))
            throw new SecurityException("Only admins can access this resource");

        List<AnalystEntity> entities = analystRepo.findAllByTeamIsNotNull();
        return entities.stream()
                .map(this::mapToAnalystResponse)
                .toList();
    }

    @Transactional
    public UserResponse updateUser(UpdateUserRequest request) {
        Long id = authUtils.getCurrentUserId();
        String role = authUtils.getCurrentUserRole();
        String token = authUtils.getCurrentToken();

        Object updatedEntity = switch (role) {
            case "admin" -> {
                var e = adminRepo.findById(id).orElseThrow();
                applyUpdates(e, request);
                yield adminRepo.save(e);
            }
            case "coach" -> {
                var e = coachRepo.findById(id).orElseThrow();
                applyUpdates(e, request);
                yield coachRepo.save(e);
            }
            case "analyst" -> {
                var e = analystRepo.findById(id).orElseThrow();
                applyUpdates(e, request);
                yield analystRepo.save(e);
            }
            default -> {
                var e = userRepo.findById(id).orElseThrow();
                applyUpdates(e, request);
                yield userRepo.save(e);
            }
        };

        return mapToResponse(updatedEntity, role, token);
    }

    @Transactional
    public UserResponse updatePassword(UpdatePasswordRequest request) {
        Long id = authUtils.getCurrentUserId();
        String role = authUtils.getCurrentUserRole();
        String token = authUtils.getCurrentToken();
        if (request.getCurrentPassword() == null || request.getNewPassword() == null
                || request.getConfirmPassword() == null) {
            throw new IllegalArgumentException("All password fields are required");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }
        if (request.getNewPassword().length() < 5) {
            throw new IllegalArgumentException("New password must be at least 5 characters long");
        }
        Object updatedEntity = switch (role) {
            case "admin" -> {
                var e = adminRepo.findById(id).orElseThrow();
                applyUpdatedPassword(e, request);
                yield adminRepo.save(e);
            }
            case "coach" -> {
                var e = coachRepo.findById(id).orElseThrow();
                applyUpdatedPassword(e, request);
                yield coachRepo.save(e);
            }
            case "analyst" -> {
                var e = analystRepo.findById(id).orElseThrow();
                applyUpdatedPassword(e, request);
                yield analystRepo.save(e);
            }
            default -> {
                var e = userRepo.findById(id).orElseThrow();
                applyUpdatedPassword(e, request);
                yield userRepo.save(e);
            }
        };

        return mapToResponse(updatedEntity, role, token);
    }

    private void applyUpdates(Object entity, UpdateUserRequest request) {
        if (request.getName() != null) {
            if (entity instanceof LeagueAdminEntity e)
                e.setName(request.getName());
            if (entity instanceof CoachEntity e)
                e.setName(request.getName());
            if (entity instanceof AnalystEntity e)
                e.setName(request.getName());
            if (entity instanceof UserEntity e)
                e.setName(request.getName());
        }

        if (request.getAvatar() != null) {
            if (entity instanceof LeagueAdminEntity e)
                e.setAvatar(request.getAvatar());
            if (entity instanceof CoachEntity e)
                e.setAvatar(request.getAvatar());
            if (entity instanceof AnalystEntity e)
                e.setAvatar(request.getAvatar());
            if (entity instanceof UserEntity e)
                e.setAvatar(request.getAvatar());
        }
    }

    private void applyUpdatedPassword(Object entity, UpdatePasswordRequest request) {
        if (request.getNewPassword() != null) {
            String encodedPass = passwordEncoder.encode(request.getNewPassword());

            if (entity instanceof LeagueAdminEntity e) {
                e.setPassword(encodedPass);
                e.setSessionVersion(e.getSessionVersion() + 1);
            } else if (entity instanceof CoachEntity e) {
                e.setPassword(encodedPass);
                e.setSessionVersion(e.getSessionVersion() + 1);
            } else if (entity instanceof AnalystEntity e) {
                e.setPassword(encodedPass);
                e.setSessionVersion(e.getSessionVersion() + 1);
            } else if (entity instanceof UserEntity e) {
                e.setPassword(encodedPass);
                e.setSessionVersion(e.getSessionVersion() + 1);
            }
        }
    }

    private UserResponse mapToResponse(Object entity, String role, String token) {
        var builder = UserResponse.builder().user_type(role).token(token);

        if (entity instanceof LeagueAdminEntity e) {
            builder.name(e.getName()).email(e.getEmail()).avatar(e.getAvatar()).slug_user(e.getSlug());
        } else if (entity instanceof CoachEntity e) {
            builder.name(e.getName()).email(e.getEmail()).avatar(e.getAvatar()).slug_user(e.getSlug())
                    .slug_team(e.getTeam() != null ? e.getTeam().getSlug() : null);
        } else if (entity instanceof AnalystEntity e) {
            builder.name(e.getName()).email(e.getEmail()).avatar(e.getAvatar()).slug_user(e.getSlug())
                    .slug_team(e.getTeam() != null ? e.getTeam().getSlug() : null);
        } else if (entity instanceof UserEntity e) {
            builder.name(e.getName()).email(e.getEmail()).avatar(e.getAvatar()).slug_user(e.getSlug());
        }

        return builder.build();
    }

    private CoachResponse mapToCoachResponse(CoachEntity e) {
        return CoachResponse.builder()
                .name(e.getName())
                .email(e.getEmail())
                .avatar(e.getAvatar())
                .slug_coach(e.getSlug())
                .user_type("coach") // Añadimos esto para que no sea null
                .slug_team(e.getTeam() != null ? e.getTeam().getSlug() : null)
                .build();
    }

    private AnalystResponse mapToAnalystResponse(AnalystEntity e) {
        return AnalystResponse.builder()
                .name(e.getName())
                .email(e.getEmail())
                .avatar(e.getAvatar())
                .slug_analyst(e.getSlug())
                .user_type("analyst")
                .slug_team(e.getTeam() != null ? e.getTeam().getSlug() : null)
                .build();
    }
}
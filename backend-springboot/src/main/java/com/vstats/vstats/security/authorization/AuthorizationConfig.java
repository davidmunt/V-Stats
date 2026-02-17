package com.vstats.vstats.security.authorization;

import com.vstats.vstats.infrastructure.repositories.CategoryRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueRepository;
import com.vstats.vstats.infrastructure.repositories.SeasonTeamRepository;
import com.vstats.vstats.infrastructure.repositories.TeamRepository;
import com.vstats.vstats.infrastructure.repositories.VenueRepository;
import com.vstats.vstats.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("authZ")
@RequiredArgsConstructor
public class AuthorizationConfig {

    private final AuthUtils authUtils;
    private final LeagueRepository leagueRepository;
    private final VenueRepository venueRepository;
    private final CategoryRepository categoryRepository;
    private final SeasonTeamRepository seasonTeamRepository;

    public boolean isLeagueAdmin(String slug) {
        if (!isAuthenticated())
            return false;

        return leagueRepository.findBySlug(slug)
                .map(league -> {
                    return league.getAdmin().getIdAdmin().equals(authUtils.getCurrentUserId());
                })
                .orElse(false);
    }

    public boolean isTeamAdmin(String slug) {
        if (!isAuthenticated())
            return false;

        return seasonTeamRepository.findByTeam_Slug(slug)
                .map(seasonTeam -> {
                    try {
                        Long adminId = seasonTeam.getLeague()
                                .getAdmin()
                                .getIdAdmin();

                        return adminId.equals(authUtils.getCurrentUserId());
                    } catch (NullPointerException e) {
                        return false;
                    }
                })
                .orElse(false);
    }

    public boolean isVenueAdmin(String slug) {
        if (!isAuthenticated())
            return false;

        return venueRepository.findBySlug(slug)
                .map(venue -> {
                    return venue.getAdmin().getIdAdmin().equals(authUtils.getCurrentUserId());
                })
                .orElse(false);
    }

    public boolean isCategoryAdmin(String slug) {
        if (!isAuthenticated())
            return false;

        return categoryRepository.findBySlug(slug)
                .map(category -> {
                    return category.getAdmin().getIdAdmin().equals(authUtils.getCurrentUserId());
                })
                .orElse(false);
    }

    public boolean isAuthenticated() {
        return authUtils.isAuthenticated();
    }

    public boolean hasRole(String role) {
        String currentRole = authUtils.getCurrentUserRole();
        return currentRole != null && currentRole.equals(role);
    }
}
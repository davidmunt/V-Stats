package com.vstats.vstats.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.vstats.vstats.infrastructure.repositories.AnalystRepository;
import com.vstats.vstats.infrastructure.repositories.CoachRepository;
import com.vstats.vstats.infrastructure.repositories.LeagueAdminRepository;
import com.vstats.vstats.infrastructure.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final LeagueAdminRepository adminRepo;
    private final CoachRepository coachRepo;
    private final AnalystRepository analystRepo;
    private final UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // 1. Buscar en Admin
        var admin = adminRepo.findByEmail(email);
        if (admin.isPresent()) {
            var a = admin.get();
            return new AuthenticatedUser(a.getIdAdmin(), a.getEmail(), a.getPassword(), "admin", a,
                    a.getSessionVersion());
        }

        // 2. Buscar en Coach
        var coach = coachRepo.findByEmail(email);
        if (coach.isPresent()) {
            var c = coach.get();
            return new AuthenticatedUser(c.getIdCoach(), c.getEmail(), c.getPassword(), "coach", c,
                    c.getSessionVersion());
        }

        // 3. Buscar en Analyst
        var analyst = analystRepo.findByEmail(email);
        if (analyst.isPresent()) {
            var an = analyst.get();
            return new AuthenticatedUser(an.getIdAnalyst(), an.getEmail(), an.getPassword(), "analyst", an,
                    an.getSessionVersion());
        }

        // 4. Buscar en User
        var user = userRepo.findByEmail(email);
        if (user.isPresent()) {
            var u = user.get();
            return new AuthenticatedUser(u.getIdUser(), u.getEmail(), u.getPassword(), "user", u,
                    u.getSessionVersion());
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + email);
    }
}
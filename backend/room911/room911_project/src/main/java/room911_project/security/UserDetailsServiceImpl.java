package room911_project.security;

import room911_project.model.Admin;
import room911_project.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Admin no encontrado: " + email));

        // Protección contra isActive = null (datos legacy en BD sin valor)
        Boolean active = admin.getIsActive();
        if (Boolean.FALSE.equals(active)) {
            throw new DisabledException(
                    "Cuenta desactivada. Contacte al Super Administrador");
        }

        return User.builder()
                .username(admin.getEmail())
                .password(admin.getPasswordHash())
                .authorities(List.of(new SimpleGrantedAuthority(
                        admin.getRole().name())))
                .build();
    }
}
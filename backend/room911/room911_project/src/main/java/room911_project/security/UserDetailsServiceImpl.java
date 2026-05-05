package room911_project.security;

import java.util.List;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import room911_project.model.Admin;
import room911_project.repository.AdminRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AdminRepository adminRepository;

    public UserDetailsServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

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
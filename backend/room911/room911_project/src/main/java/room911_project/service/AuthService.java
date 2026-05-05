package room911_project.service;

import room911_project.dto.request.*;
import room911_project.dto.response.AuthResponse;
import room911_project.exception.BadRequestException;
import room911_project.exception.ResourceNotFoundException;
import room911_project.model.Admin;
import room911_project.repository.AdminRepository;
import room911_project.security.JwtUtil;
import room911_project.security.UserDetailsServiceImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;
    public AuthService(AdminRepository adminRepository, AuthenticationManager authManager, JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword())
        );

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin no encontrado"));

        admin.setLastLoginAt(OffsetDateTime.now());
        adminRepository.save(admin);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(
                userDetails,
                admin.getRole().name(),
                admin.getId().toString()
        );

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(admin.getId().toString())
                .email(admin.getEmail())
                .firstName(admin.getFirstName())
                .lastName(admin.getLastName())
                .role(admin.getRole().name())
                .departmentId(admin.getDepartment() != null
                        ? admin.getDepartment().getId() : null)
                .departmentName(admin.getDepartment() != null
                        ? admin.getDepartment().getName() : null)
                .avatarUrl(admin.getAvatarUrl())
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        // Silencioso por seguridad — no revelar si email existe
        adminRepository.findByEmail(request.getEmail()).ifPresent(admin -> {
            // TODO: implementar con EmailService cuando SMTP esté configurado
            // 1. Generar token UUID con expiración 30 minutos
            // 2. Guardar en tabla password_reset_tokens
            // 3. Enviar email con enlace
        });
    }

    public void resetPassword(ResetPasswordRequest request) {
        // TODO: buscar token, validar expiración, actualizar password
        throw new BadRequestException("Funcionalidad en implementación");
    }

    public void changePassword(String adminEmail, ChangePasswordRequest request) {
        Admin admin = adminRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Admin no encontrado"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPasswordHash())) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }

        admin.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);
    }
}
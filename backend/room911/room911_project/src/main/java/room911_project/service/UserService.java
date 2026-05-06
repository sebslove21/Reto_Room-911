package room911_project.service;

import room911_project.dto.request.UpdateProfileRequest;
import room911_project.dto.response.AdminResponse;
import room911_project.model.Admin;
import room911_project.repository.AdminRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Base64;

@Service
public class UserService {

    private final AdminRepository adminRepository;

    public UserService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public AdminResponse getCurrentUser(String email) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return toResponse(admin);
    }

    public AdminResponse updateProfile(String email, UpdateProfileRequest request) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (request.getFirstName() != null) {
            admin.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            admin.setLastName(request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(email)) {
            admin.setEmail(request.getEmail());
        }

        admin = adminRepository.save(admin);
        return toResponse(admin);
    }

    public AdminResponse uploadAvatar(String email, MultipartFile file) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (file.isEmpty()) {
            throw new RuntimeException("Archivo vacío");
        }

        // Límite de 2MB para la imagen
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new RuntimeException("Archivo muy grande (máx 2MB)");
        }

        try {
            byte[] fileBytes = file.getBytes();
            String base64String = "data:" + file.getContentType() + ";base64," 
                    + Base64.getEncoder().encodeToString(fileBytes);
            
            admin.setAvatarUrl(base64String);
            admin = adminRepository.save(admin);
            return toResponse(admin);
        } catch (IOException e) {
            throw new RuntimeException("Error al procesar archivo: " + e.getMessage());
        }
    }

    private AdminResponse toResponse(Admin admin) {
        return AdminResponse.builder()
                .id(admin.getId() != null ? admin.getId().toString() : null)
                .firstName(admin.getFirstName())
                .lastName(admin.getLastName())
                .email(admin.getEmail())
                .departmentName(admin.getDepartment() != null 
                    ? admin.getDepartment().getName() : null)
                .isActive(admin.getIsActive())
                .avatarUrl(admin.getAvatarUrl())
                .build();
    }
}

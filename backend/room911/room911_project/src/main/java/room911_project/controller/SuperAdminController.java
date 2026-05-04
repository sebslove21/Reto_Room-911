package room911_project.controller;

import room911_project.dto.request.CreateAdminRequest;
import room911_project.dto.request.UpdateAdminRequest;
import room911_project.dto.response.AdminResponse;
import room911_project.dto.response.AuditLogResponse;
import room911_project.enums.AdminRole;
import room911_project.exception.DuplicateResourceException;
import room911_project.exception.ResourceNotFoundException;
import room911_project.model.Admin;
import room911_project.model.AdminActionLog;
import room911_project.repository.AdminActionLogRepository;
import room911_project.repository.AdminRepository;
import room911_project.repository.DepartmentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/superadmin")
@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
@RequiredArgsConstructor
public class SuperAdminController {

    private final AdminRepository          adminRepository;
    private final DepartmentRepository     departmentRepository;
    private final AdminActionLogRepository auditLogRepository;
    private final PasswordEncoder          passwordEncoder;

    // ── Admins ────────────────────────────────────────────────────────────────

    @GetMapping("/admins")
    public ResponseEntity<List<AdminResponse>> getAdmins() {
        return ResponseEntity.ok(
                adminRepository.findAll().stream()
                        .map(this::toAdminResponse)
                        .collect(Collectors.toList()));
    }

    @PostMapping("/admins")
    public ResponseEntity<AdminResponse> createAdmin(
            @Valid @RequestBody CreateAdminRequest request) {

        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("El email ya está en uso");
        }

        var dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Departamento no encontrado"));

        Admin admin = new Admin();
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setEmail(request.getEmail());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        admin.setRole(AdminRole.ROLE_ADMIN);
        admin.setDepartment(dept);
        admin.setIsActive(true);

        return ResponseEntity.status(201)
                .body(toAdminResponse(adminRepository.save(admin)));
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<AdminResponse> updateAdmin(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAdminRequest request) {

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Admin no encontrado"));

        if (request.getFirstName() != null)
            admin.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            admin.setLastName(request.getLastName());
        if (request.getIsActive() != null)
            admin.setIsActive(request.getIsActive());
        if (request.getDepartmentId() != null) {
            var dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Departamento no encontrado"));
            admin.setDepartment(dept);
        }

        return ResponseEntity.ok(toAdminResponse(adminRepository.save(admin)));
    }

    @PatchMapping("/admins/{id}/status")
    public ResponseEntity<Void> toggleStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> body) {

        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Admin no encontrado"));
        admin.setIsActive(body.get("isActive"));
        adminRepository.save(admin);
        return ResponseEntity.ok().build();
    }

    // ── Audit Log ─────────────────────────────────────────────────────────────

    @GetMapping("/audit-log")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLog(
            @RequestParam(required = false) String adminId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        UUID adminUuid = adminId != null ? UUID.fromString(adminId) : null;
        java.time.ZoneOffset bogota = java.time.ZoneOffset.ofHours(-5);

        java.time.OffsetDateTime start = startDate != null
                ? java.time.LocalDate.parse(startDate)
                        .atStartOfDay().atOffset(bogota) : null;
        java.time.OffsetDateTime end = endDate != null
                ? java.time.LocalDate.parse(endDate)
                        .atTime(23, 59, 59).atOffset(bogota) : null;

        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());

        Page<AuditLogResponse> result = auditLogRepository
                .findAuditFiltered(adminUuid, start, end, pageable)
                .map(this::toAuditResponse);

        return ResponseEntity.ok(result);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private AdminResponse toAdminResponse(Admin a) {
        return AdminResponse.builder()
                .id(a.getId().toString())
                .firstName(a.getFirstName())
                .lastName(a.getLastName())
                .email(a.getEmail())
                .role(a.getRole().name())
                .departmentId(a.getDepartment() != null
                        ? a.getDepartment().getId() : null)
                .departmentName(a.getDepartment() != null
                        ? a.getDepartment().getName() : null)
                .isActive(a.getIsActive())
                .lastLoginAt(a.getLastLoginAt())
                .avatarUrl(a.getAvatarUrl())
                .createdAt(a.getCreatedAt())
                .build();
    }

    private AuditLogResponse toAuditResponse(AdminActionLog l) {
        return AuditLogResponse.builder()
                .id(l.getId())
                .adminId(l.getAdmin() != null
                        ? l.getAdmin().getId().toString() : null)
                .adminName(l.getAdmin() != null
                        ? l.getAdmin().getFirstName() + " " + l.getAdmin().getLastName()
                        : null)
                .actionType(l.getActionType().name())
                .entity(l.getEntity())
                .entityId(l.getEntityId())
                .description(l.getDescription())
                .createdAt(l.getCreatedAt())
                .build();
    }
}
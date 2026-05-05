package room911_project.service;

import room911_project.dto.response.DashboardSummaryResponse;
import room911_project.dto.response.DepartmentStatsResponse;
import room911_project.enums.AccessResult;
import room911_project.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final AccessLogRepository    accessLogRepository;
    private final EmployeeRepository     employeeRepository;
    private final AdminRepository        adminRepository;
    private final RoomSettingsRepository roomSettingsRepository;
    private final DepartmentRepository   departmentRepository;
    public StatisticsService(AccessLogRepository accessLogRepository, EmployeeRepository employeeRepository, AdminRepository adminRepository, RoomSettingsRepository roomSettingsRepository, DepartmentRepository departmentRepository) {
        this.accessLogRepository = accessLogRepository;
        this.employeeRepository = employeeRepository;
        this.adminRepository = adminRepository;
        this.roomSettingsRepository = roomSettingsRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        ZoneOffset tz = ZoneOffset.ofHours(-5);
        OffsetDateTime startOfDay = LocalDate.now(tz).atStartOfDay().atOffset(tz);

        int maxCap = roomSettingsRepository.findAll().stream().findFirst()
                .map(s -> s.getMaxCapacity()).orElse(0);

        long activeAdmins = adminRepository.findAll().stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsActive())).count();

        return DashboardSummaryResponse.builder()
                .totalEmployees(employeeRepository.count())
                .accessesToday(accessLogRepository.countByResultAfter(startOfDay, AccessResult.GRANTED))
                .currentOccupancy(employeeRepository.countByIsInsideTrue())
                .maxCapacity(maxCap)
                .deniedToday(accessLogRepository.countByAccessedAtAfter(startOfDay)
                        - accessLogRepository.countByResultAfter(startOfDay, AccessResult.GRANTED))
                .activeAdmins(activeAdmins)
                .build();
    }

    @Transactional(readOnly = true)
    public List<DepartmentStatsResponse> getByDepartment(
            String period, String startDate, String endDate) {

        ZoneOffset tz = ZoneOffset.ofHours(-5);
        OffsetDateTime start = resolveStart(period, startDate, tz);
        OffsetDateTime end   = resolveEnd(endDate, tz);
        long total = accessLogRepository.countByAccessedAtAfter(start);

        return departmentRepository.findAll().stream().map(dept -> {
            long granted = accessLogRepository.countByResultAndDepartment(
                    start, AccessResult.GRANTED, dept.getId());
            long denied  = accessLogRepository.countByAccessedAtAfter(start)
                    - accessLogRepository.countByResultAndDepartment(
                            start, AccessResult.GRANTED, dept.getId());
            // Recalcular denied por departamento correctamente
            denied = accessLogRepository.countByResultAndDepartment(
                    start, AccessResult.DENIED_NO_PERMISSION, dept.getId())
                    + accessLogRepository.countByResultAndDepartment(
                            start, AccessResult.DENIED_NOT_FOUND, dept.getId())
                    + accessLogRepository.countByResultAndDepartment(
                            start, AccessResult.DENIED_MAX_CAPACITY, dept.getId());

            double pct = total > 0 ? ((granted + denied) * 100.0) / total : 0;

            return DepartmentStatsResponse.builder()
                    .departmentId(dept.getId())
                    .departmentName(dept.getName())
                    .totalAccesses(granted + denied)
                    .grantedAccesses(granted)
                    .deniedAccesses(denied)
                    .percentage(Math.round(pct * 10.0) / 10.0)
                    .build();
        }).collect(Collectors.toList());
    }

    private OffsetDateTime resolveStart(String period, String startDate, ZoneOffset tz) {
        if (startDate != null)
            return LocalDate.parse(startDate).atStartOfDay().atOffset(tz);
        LocalDate today = LocalDate.now(tz);
        return switch (period != null ? period : "today") {
            case "week"  -> today.minusDays(7).atStartOfDay().atOffset(tz);
            case "month" -> today.minusDays(30).atStartOfDay().atOffset(tz);
            default      -> today.atStartOfDay().atOffset(tz);
        };
    }

    private OffsetDateTime resolveEnd(String endDate, ZoneOffset tz) {
        return endDate != null
                ? LocalDate.parse(endDate).atTime(23, 59, 59).atOffset(tz)
                : OffsetDateTime.now(tz);
    }
}
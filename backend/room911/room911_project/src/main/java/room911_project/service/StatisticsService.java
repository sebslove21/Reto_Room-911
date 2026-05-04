package room911_project.service;

import room911_project.dto.response.DashboardSummaryResponse;
import room911_project.dto.response.DepartmentStatsResponse;
import room911_project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final AccessLogRepository    accessLogRepository;
    private final EmployeeRepository     employeeRepository;
    private final AdminRepository        adminRepository;
    private final RoomSettingsRepository roomSettingsRepository;
    private final DepartmentRepository   departmentRepository;

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary() {
        ZoneOffset tz = ZoneOffset.ofHours(-5);
        OffsetDateTime startOfDay = LocalDate.now(tz)
                .atStartOfDay().atOffset(tz);

        int maxCap = roomSettingsRepository.findAll()
                .stream().findFirst()
                .map(s -> s.getMaxCapacity()).orElse(0);

        long activeAdmins = adminRepository.findAll()
                .stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsActive()))
                .count();

        long totalEmployees  = employeeRepository.count();
        long accessesToday   = accessLogRepository
                .countGrantedAfter(startOfDay);
        long currentOccupancy= employeeRepository.countByIsInsideTrue();
        long deniedToday     = accessLogRepository
                .countDeniedAfter(startOfDay);

        return DashboardSummaryResponse.builder()
                .totalEmployees(totalEmployees)
                .accessesToday(accessesToday)
                .currentOccupancy(currentOccupancy)
                .maxCapacity(maxCap)
                .deniedToday(deniedToday)
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
            long granted = accessLogRepository
                    .countGrantedByDepartment(start, dept.getId());
            long denied  = accessLogRepository
                    .countDeniedByDepartment(start, dept.getId());
            double pct = total > 0
                    ? ((granted + denied) * 100.0) / total : 0;

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

    private OffsetDateTime resolveStart(
            String period, String startDate, ZoneOffset tz) {
        if (startDate != null)
            return LocalDate.parse(startDate)
                    .atStartOfDay().atOffset(tz);
        LocalDate today = LocalDate.now(tz);
        return switch (period != null ? period : "today") {
            case "week"  -> today.minusDays(7)
                    .atStartOfDay().atOffset(tz);
            case "month" -> today.minusDays(30)
                    .atStartOfDay().atOffset(tz);
            default      -> today.atStartOfDay().atOffset(tz);
        };
    }

    private OffsetDateTime resolveEnd(
            String endDate, ZoneOffset tz) {
        return endDate != null
                ? LocalDate.parse(endDate)
                        .atTime(23, 59, 59).atOffset(tz)
                : OffsetDateTime.now(tz);
    }
}
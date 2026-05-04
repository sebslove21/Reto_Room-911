package room911_project.service;

import room911_project.dto.request.AccessValidateRequest;
import room911_project.dto.response.*;
import room911_project.enums.AccessResult;
import room911_project.model.*;
import room911_project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccessService {

    private final EmployeeRepository employeeRepository;
    private final AccessLogRepository accessLogRepository;
    private final RoomSettingsRepository roomSettingsRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public AccessLogResponse validate(AccessValidateRequest request) {
        String internalId = request.getInternalId().trim().toUpperCase();
        OffsetDateTime now = OffsetDateTime.now();
        RoomSettings settings = getSettings();

        Optional<Employee> empOpt = employeeRepository.findByInternalId(internalId);

        // Empleado no registrado
        if (empOpt.isEmpty()) {
            AccessLog log = saveLog(null, internalId,
                    AccessResult.DENIED_NOT_FOUND, now, "Empleado no registrado");
            broadcastAccessEvent(log, null);
            return toLogResponse(log);
        }

        Employee employee = empOpt.get();

        // Sin permiso
        if (!employee.getHasAccess()) {
            AccessLog log = saveLog(employee, internalId,
                    AccessResult.DENIED_NO_PERMISSION, now, "Sin permiso de acceso");
            broadcastAccessEvent(log, employee);
            return toLogResponse(log);
        }

        // Toggle: si está dentro → salida
        if (employee.getIsInside()) {
            employee.setIsInside(false);
            employee.setEnteredAt(null);
            employeeRepository.save(employee);
            AccessLog log = saveLog(employee, internalId,
                    AccessResult.GRANTED, now, "Salida registrada");
            broadcastCapacityUpdate();
            broadcastAccessEvent(log, employee);
            return toLogResponse(log);
        }

        // Verificar aforo
        long currentOccupancy = employeeRepository.countByIsInsideTrue();
        if (currentOccupancy >= settings.getMaxCapacity()) {
            AccessLog log = saveLog(employee, internalId,
                    AccessResult.DENIED_MAX_CAPACITY, now, "Aforo máximo alcanzado");
            broadcastAccessEvent(log, employee);
            return toLogResponse(log);
        }

        // Entrada concedida
        employee.setIsInside(true);
        employee.setEnteredAt(now);
        employeeRepository.save(employee);
        AccessLog log = saveLog(employee, internalId,
                AccessResult.GRANTED, now, "Entrada registrada");
        broadcastCapacityUpdate();
        broadcastAccessEvent(log, employee);
        return toLogResponse(log);
    }

    public RoomStatusResponse getRoomStatus() {
        RoomSettings settings = getSettings();
        List<Employee> inside = employeeRepository.findByIsInsideTrue();
        int occupancy = inside.size();
        int pct = settings.getMaxCapacity() > 0
                ? (int) Math.round((occupancy * 100.0) / settings.getMaxCapacity())
                : 0;

        List<EmployeePresenceResponse> presences = inside.stream()
                .map(e -> buildPresence(e, settings.getMaxStayMinutes()))
                .collect(Collectors.toList());

        return RoomStatusResponse.builder()
                .currentOccupancy(occupancy)
                .maxCapacity(settings.getMaxCapacity())
                .maxStayMinutes(settings.getMaxStayMinutes())
                .alertThresholdPct(settings.getAlertThresholdPct())
                .occupancyPercentage(pct)
                .employeesInside(presences)
                .build();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private RoomSettings getSettings() {
        return roomSettingsRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new RuntimeException(
                        "room_settings no configurado en BD"));
    }

    private AccessLog saveLog(Employee employee, String rawId,
                               AccessResult result, OffsetDateTime at, String notes) {
        return accessLogRepository.save(AccessLog.builder()
                .employee(employee)
                .internalIdRaw(rawId)
                .result(result)
                .accessedAt(at)
                .notes(notes)
                .build());
    }

    private void broadcastCapacityUpdate() {
        try {
            messagingTemplate.convertAndSend(
                    "/topic/room.capacity", getRoomStatus());
        } catch (Exception ignored) {}
    }

    private void broadcastAccessEvent(AccessLog log, Employee employee) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("result", log.getResult().name());
            event.put("internalId", log.getInternalIdRaw());
            event.put("employeeId", employee != null ? employee.getId() : null);
            event.put("employeeName", employee != null
                    ? employee.getFirstName() + " " + employee.getLastName() : null);
            event.put("timestamp", log.getAccessedAt().toString());
            messagingTemplate.convertAndSend("/topic/access.event", event);
        } catch (Exception ignored) {}
    }

    private EmployeePresenceResponse buildPresence(Employee e, int maxMinutes) {
        long minutesInside = e.getEnteredAt() != null
                ? Duration.between(e.getEnteredAt(), OffsetDateTime.now()).toMinutes()
                : 0;
        double ratio = maxMinutes > 0 ? (double) minutesInside / maxMinutes : 0;
        String status = ratio >= 1.5 ? "critical" : ratio >= 1.0 ? "warning" : "normal";

        return EmployeePresenceResponse.builder()
                .id(e.getId())
                .internalId(e.getInternalId())
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .departmentName(e.getDepartment().getName())
                .enteredAt(e.getEnteredAt())
                .minutesInside(minutesInside)
                .status(status)
                .build();
    }

    private AccessLogResponse toLogResponse(AccessLog log) {
        Employee emp = log.getEmployee();
        return AccessLogResponse.builder()
                .id(log.getId())
                .employeeId(emp != null ? emp.getId() : null)
                .internalIdRaw(log.getInternalIdRaw())
                .employeeName(emp != null
                        ? emp.getFirstName() + " " + emp.getLastName() : null)
                .departmentName(emp != null && emp.getDepartment() != null
                        ? emp.getDepartment().getName() : null)
                .result(log.getResult().name())
                .accessedAt(log.getAccessedAt())
                .notes(log.getNotes())
                .build();
    }
}
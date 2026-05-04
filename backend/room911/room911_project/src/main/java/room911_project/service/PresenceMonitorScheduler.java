package room911_project.service;

import room911_project.model.Employee;
import room911_project.model.RoomSettings;
import room911_project.repository.EmployeeRepository;
import room911_project.repository.RoomSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class PresenceMonitorScheduler {

    private final EmployeeRepository     employeeRepository;
    private final RoomSettingsRepository roomSettingsRepository;
    private final SimpMessagingTemplate  messagingTemplate;

    @Scheduled(fixedRate = 60000)
    public void checkStayTimes() {
        RoomSettings settings = roomSettingsRepository.findAll()
                .stream().findFirst().orElse(null);
        if (settings == null) return;

        List<Employee> inside = employeeRepository.findByIsInsideTrue();
        int maxMinutes = settings.getMaxStayMinutes();

        inside.forEach(emp -> {
            if (emp.getEnteredAt() == null) return;

            long minutes = Duration.between(
                    emp.getEnteredAt(), OffsetDateTime.now()).toMinutes();
            double ratio = (double) minutes / maxMinutes;

            if (ratio >= 1.0) {
                Map<String, Object> alert = new HashMap<>();
                alert.put("type", ratio >= 1.5 ? "TIME_CRITICAL" : "TIME_WARNING");
                alert.put("employeeId", emp.getId());
                alert.put("employeeName",
                        emp.getFirstName() + " " + emp.getLastName());
                alert.put("message", "Lleva " + minutes
                        + " min dentro del ROOM_911 (máx " + maxMinutes + " min)");
                alert.put("timestamp", OffsetDateTime.now().toString());

                messagingTemplate.convertAndSend("/topic/alerts", alert);
                log.warn("[ROOM_911] Alerta: {} lleva {} minutos dentro",
                        emp.getInternalId(), minutes);
            }
        });
    }
}
package room911_project.controller;

import room911_project.dto.request.RoomSettingsRequest;
import room911_project.exception.ResourceNotFoundException;
import room911_project.model.RoomSettings;
import room911_project.repository.RoomSettingsRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/room")
public class RoomSettingsController {

    

    private final RoomSettingsRepository roomSettingsRepository;

    public RoomSettingsController(RoomSettingsRepository roomSettingsRepository) {
        this.roomSettingsRepository = roomSettingsRepository;
    }

    @GetMapping("/settings")
    public ResponseEntity<RoomSettings> getSettings() {
        RoomSettings settings = roomSettingsRepository.findAll()
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Configuración no encontrada"));
        return ResponseEntity.ok(settings);
    }

    @PutMapping("/settings")
    public ResponseEntity<RoomSettings> updateSettings(
            @Valid @RequestBody RoomSettingsRequest request) {
        RoomSettings settings = roomSettingsRepository.findAll()
                .stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Configuración no encontrada"));

        if (request.getMaxCapacity() != null)
            settings.setMaxCapacity(request.getMaxCapacity());
        if (request.getMaxStayMinutes() != null)
            settings.setMaxStayMinutes(request.getMaxStayMinutes());
        if (request.getAlertThresholdPct() != null)
            settings.setAlertThresholdPct(request.getAlertThresholdPct());

        return ResponseEntity.ok(roomSettingsRepository.save(settings));
    }
}
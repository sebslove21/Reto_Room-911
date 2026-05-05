package room911_project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import room911_project.dto.request.AccessValidateRequest;
import room911_project.dto.response.AccessLogResponse;
import room911_project.dto.response.RoomStatusResponse;
import room911_project.service.AccessService;

@RestController
public class AccessController {

    

    private final AccessService accessService;

    public AccessController(AccessService accessService) {
        this.accessService = accessService;
    }

    @PostMapping("/api/access/validate")
    public ResponseEntity<AccessLogResponse> validate(
            @Valid @RequestBody AccessValidateRequest request) {
        return ResponseEntity.ok(accessService.validate(request));
    }

    @GetMapping("/api/room/status")
    public ResponseEntity<RoomStatusResponse> getRoomStatus() {
        return ResponseEntity.ok(accessService.getRoomStatus());
    }

    @PostMapping("/api/access/demo-enter")
    public ResponseEntity<AccessLogResponse> demoEnter(
            @Valid @RequestBody AccessValidateRequest request) {
        // Endpoint de demo para pruebas: simula una entrada
        return ResponseEntity.ok(accessService.validate(request));
    }
}
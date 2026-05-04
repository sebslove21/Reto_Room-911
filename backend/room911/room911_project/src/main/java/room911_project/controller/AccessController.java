package room911_project.controller;

import room911_project.dto.request.AccessValidateRequest;
import room911_project.dto.response.AccessLogResponse;
import room911_project.dto.response.RoomStatusResponse;
import room911_project.service.AccessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AccessController {

    private final AccessService accessService;

    @PostMapping("/api/access/validate")
    public ResponseEntity<AccessLogResponse> validate(
            @Valid @RequestBody AccessValidateRequest request) {
        return ResponseEntity.ok(accessService.validate(request));
    }

    @GetMapping("/api/room/status")
    public ResponseEntity<RoomStatusResponse> getRoomStatus() {
        return ResponseEntity.ok(accessService.getRoomStatus());
    }
}
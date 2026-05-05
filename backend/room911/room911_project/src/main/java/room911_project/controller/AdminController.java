package room911_project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import room911_project.service.AuthService;

@RestController
@RequestMapping("/api/users")
public class AdminController {

    private final AuthService authService;

    public AdminController(AuthService authService) {
        this.authService = authService;
    }

    // Nota: Los endpoints de perfil se implementarán en el futuro
    // Por ahora se usa el AuthController para login/logout
}



package room911_project.controller;

import room911_project.dto.request.CreateEmployeeRequest;
import room911_project.dto.request.UpdateEmployeeRequest;
import room911_project.dto.response.EmployeeResponse;
import room911_project.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private static final Logger log = LoggerFactory.getLogger(EmployeeController.class);

    

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<Page<EmployeeResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        log.info("GET /employees — search={} departmentId={} page={} size={}",
                search, departmentId, page, size);

        return ResponseEntity.ok(
                employeeService.search(search, departmentId, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> getById(
            @PathVariable Integer id) {
        return ResponseEntity.ok(employeeService.getById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> create(
            @Valid @RequestBody CreateEmployeeRequest request) {
        return ResponseEntity.status(201)
                .body(employeeService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateEmployeeRequest request) {
        return ResponseEntity.ok(employeeService.update(id, request));
    }

    @PatchMapping("/{id}/access")
    public ResponseEntity<EmployeeResponse> toggleAccess(
            @PathVariable Integer id,
            @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(
                employeeService.toggleAccess(id, body.get("hasAccess")));
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importCsv(
            @RequestParam("file") MultipartFile file,
            @RequestParam Integer departmentId) throws IOException {

        log.info("POST /employees/import — departmentId={} filename={}",
                departmentId, file.getOriginalFilename());

        return ResponseEntity.ok(
                employeeService.importCsv(file, departmentId));
    }

    @GetMapping("/template")
    public ResponseEntity<byte[]> template() {
        String csv = "internal_id,first_name,last_name,email\n"
                   + "EMP-001,Juan,Pérez,juan@lab.com\n"
                   + "EMP-002,Maria,García,maria@lab.com\n";
        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=plantilla.csv")
                .header("Content-Type", "text/csv; charset=UTF-8")
                .body(csv.getBytes());
    }
}
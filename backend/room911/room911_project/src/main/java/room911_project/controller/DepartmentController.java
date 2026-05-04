package room911_project.controller;

import room911_project.dto.request.DepartmentRequest;
import room911_project.model.Department;
import room911_project.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<List<Department>> getAll() {
        return ResponseEntity.ok(departmentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(departmentService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Department> create(
            @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.status(201).body(departmentService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(
            @PathVariable Integer id,
            @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(departmentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        departmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

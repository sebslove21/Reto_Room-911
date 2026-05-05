package room911_project.service;

import room911_project.dto.request.CreateEmployeeRequest;
import room911_project.dto.request.UpdateEmployeeRequest;
import room911_project.dto.response.EmployeeResponse;
import room911_project.exception.BadRequestException;
import room911_project.exception.DuplicateResourceException;
import room911_project.exception.ResourceNotFoundException;
import room911_project.model.Department;
import room911_project.model.Employee;
import room911_project.repository.DepartmentRepository;
import room911_project.repository.EmployeeRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.util.*;

@Service
public class EmployeeService {

    private final EmployeeRepository   employeeRepository;
    private final DepartmentRepository departmentRepository;
    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional(readOnly = true)
    public Page<EmployeeResponse> search(String search,
            Integer departmentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("lastName").ascending());
        return employeeRepository.searchEmployees(
                (search != null && !search.isBlank()) ? search : null,
                departmentId,
                pageable
        ).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(Integer id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public EmployeeResponse create(CreateEmployeeRequest request) {
        if (employeeRepository.existsByInternalId(
                request.getInternalId().toUpperCase())) {
            throw new DuplicateResourceException(
                    "El ID de empleado ya está registrado");
        }
        Department dept = findDepartment(request.getDepartmentId());
        Employee employee = new Employee();
        employee.setInternalId(request.getInternalId().toUpperCase());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(dept);
        employee.setHasAccess(false);
        employee.setIsActive(true);
        employee.setIsInside(false);
        return toResponse(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse update(Integer id, UpdateEmployeeRequest request) {
        Employee employee = findOrThrow(id);

        if (request.getInternalId() != null
                && !request.getInternalId().equalsIgnoreCase(
                        employee.getInternalId())
                && employeeRepository.existsByInternalIdAndIdNot(
                        request.getInternalId().toUpperCase(), id)) {
            throw new DuplicateResourceException(
                    "El ID ya pertenece a otro empleado");
        }

        if (request.getInternalId() != null)
            employee.setInternalId(request.getInternalId().toUpperCase());
        if (request.getFirstName() != null)
            employee.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            employee.setLastName(request.getLastName());
        if (request.getEmail() != null)
            employee.setEmail(request.getEmail());
        if (request.getHasAccess() != null)
            employee.setHasAccess(request.getHasAccess());
        if (request.getDepartmentId() != null)
            employee.setDepartment(findDepartment(request.getDepartmentId()));

        return toResponse(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponse toggleAccess(Integer id, Boolean hasAccess) {
        Employee employee = findOrThrow(id);
        employee.setHasAccess(hasAccess);
        return toResponse(employeeRepository.save(employee));
    }

    @Transactional
    public Map<String, Object> importCsv(MultipartFile file,
            Integer departmentId) throws IOException {
        Department dept = findDepartment(departmentId);
        int imported = 0, skipped = 0;
        List<String> errors = new ArrayList<>();

        try (CSVReader reader = new CSVReader(
                new InputStreamReader(file.getInputStream()))) {
            List<String[]> rows = reader.readAll();
            if (rows.isEmpty()) {
                throw new BadRequestException(
                        "El archivo CSV está vacío");
            }
            // Saltar fila de encabezado
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                // Limpiar campos vacíos al final
                if (row.length == 0 || row[0].trim().isEmpty()) {
                    continue;
                }
                if (row.length < 3) {
                    errors.add("Fila " + (i + 1)
                            + ": faltan columnas (mínimo: "
                            + "internal_id, first_name, last_name)");
                    continue;
                }
                String internalId = row[0].trim().toUpperCase();
                if (internalId.isEmpty()) continue;

                if (employeeRepository.existsByInternalId(internalId)) {
                    skipped++;
                    continue;
                }
                try {
                    Employee emp = new Employee();
                    emp.setInternalId(internalId);
                    emp.setFirstName(row[1].trim());
                    emp.setLastName(row[2].trim());
                    emp.setEmail(row.length > 3
                            && !row[3].trim().isEmpty()
                            ? row[3].trim() : null);
                    emp.setDepartment(dept);
                    emp.setHasAccess(false);
                    emp.setIsActive(true);
                    emp.setIsInside(false);
                    employeeRepository.save(emp);
                    imported++;
                } catch (Exception ex) {
                    errors.add("Fila " + (i + 1) + ": " + ex.getMessage());
                }
            }
        } catch (CsvException e) {
            throw new BadRequestException(
                    "Error al leer el CSV: " + e.getMessage());
        }

        return Map.of(
                "imported", imported,
                "skipped",  skipped,
                "errors",   errors
        );
    }

    @Transactional(readOnly = true)
    public EmployeeResponse toResponse(Employee e) {
        String deptName = "";
        Integer deptId  = null;
        try {
            if (e.getDepartment() != null) {
                deptId   = e.getDepartment().getId();
                deptName = e.getDepartment().getName();
            }
        } catch (Exception ex) {
            // lazy loading fuera de contexto — ignorar
        }
        return EmployeeResponse.builder()
                .id(e.getId())
                .internalId(e.getInternalId())
                .firstName(e.getFirstName())
                .lastName(e.getLastName())
                .email(e.getEmail())
                .departmentId(deptId)
                .departmentName(deptName)
                .hasAccess(e.getHasAccess())
                .isActive(e.getIsActive())
                .isInside(e.getIsInside())
                .enteredAt(e.getEnteredAt())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private Employee findOrThrow(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Empleado no encontrado: " + id));
    }

    private Department findDepartment(Integer id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Departamento no encontrado: " + id));
    }
}
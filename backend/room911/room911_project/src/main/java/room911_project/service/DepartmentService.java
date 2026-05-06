package room911_project.service;

import room911_project.dto.request.DepartmentRequest;
import room911_project.exception.DuplicateResourceException;
import room911_project.exception.ResourceNotFoundException;
import room911_project.model.Department;
import room911_project.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAll() {
        return departmentRepository.findAll().stream()
                .filter(d -> d.getIsActive() != null && d.getIsActive())
                .toList();
    }

    public Department getById(Integer id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Departamento no encontrado: " + id));
    }

    @Transactional
    public Department create(DepartmentRequest request) {
        if (departmentRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Ya existe un departamento con ese nombre");
        }
        Department dept = new Department();
        dept.setName(request.getName());
        dept.setDescription(request.getDescription());
        dept.setIsActive(true);
        return departmentRepository.save(dept);
    }

    @Transactional
    public Department update(Integer id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Departamento no encontrado: " + id));

        if (!dept.getName().equals(request.getName())
                && departmentRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException(
                    "Ya existe un departamento con ese nombre");
        }

        dept.setName(request.getName());
        if (request.getDescription() != null)
            dept.setDescription(request.getDescription());
        return departmentRepository.save(dept);
    }

    @Transactional
    public void delete(Integer id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Departamento no encontrado: " + id));
        dept.setIsActive(false);
        departmentRepository.save(dept);
    }
}
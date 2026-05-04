package room911_project.repository;

import room911_project.model.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    Optional<Employee> findByInternalId(String internalId);
    boolean existsByInternalId(String internalId);
    boolean existsByInternalIdAndIdNot(String internalId, Integer id);
    List<Employee> findByIsInsideTrue();
    long countByIsInsideTrue();

    @Query("""
        SELECT e FROM Employee e
        WHERE (:search IS NULL OR
               LOWER(CAST(e.internalId AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR
               LOWER(CAST(e.firstName  AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR
               LOWER(CAST(e.lastName   AS string)) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))
        AND (:departmentId IS NULL OR e.department.id = :departmentId)
        """)
    Page<Employee> searchEmployees(
            @Param("search") String search,
            @Param("departmentId") Integer departmentId,
            Pageable pageable);
}
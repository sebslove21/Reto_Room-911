package room911_project.repository;

import room911_project.enums.AccessResult;
import room911_project.model.AccessLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {

    // ── Historial paginado — sin IS NULL, siempre con fechas reales ──────────
    @Query("""
        SELECT l FROM AccessLog l
        WHERE (:employeeId IS NULL
               OR (l.employee IS NOT NULL AND l.employee.id = :employeeId))
        AND l.accessedAt >= :start
        AND l.accessedAt <= :end
        ORDER BY l.accessedAt DESC
        """)
    Page<AccessLog> findLogsFiltered(
            @Param("employeeId") Integer employeeId,
            @Param("start") OffsetDateTime start,
            @Param("end")   OffsetDateTime end,
            Pageable pageable);

    // ── PDF — también con fechas reales, sin IS NULL ───────────────────────
    @Query("""
        SELECT l FROM AccessLog l
        LEFT JOIN FETCH l.employee e
        LEFT JOIN FETCH e.department
        WHERE l.employee IS NOT NULL
        AND l.employee.id = :employeeId
        AND l.accessedAt >= :start
        AND l.accessedAt <= :end
        ORDER BY l.accessedAt DESC
        """)
    List<AccessLog> findByEmployeeForPdf(
            @Param("employeeId") Integer employeeId,
            @Param("start") OffsetDateTime start,
            @Param("end")   OffsetDateTime end);

    // ── Dashboard conteos ─────────────────────────────────────────────────────
    @Query("SELECT COUNT(l) FROM AccessLog l WHERE l.accessedAt > :since")
    long countByAccessedAtAfter(@Param("since") OffsetDateTime since);

    @Query("""
        SELECT COUNT(l) FROM AccessLog l
        WHERE l.accessedAt >= :since
        AND l.result = :result
        """)
    long countByResultAfter(
            @Param("since") OffsetDateTime since,
            @Param("result") AccessResult result);

    @Query("""
        SELECT COUNT(l) FROM AccessLog l
        WHERE l.accessedAt >= :since
        AND l.result = :result
        AND l.employee IS NOT NULL
        AND l.employee.department.id = :departmentId
        """)
    long countByResultAndDepartment(
            @Param("since") OffsetDateTime since,
            @Param("result") AccessResult result,
            @Param("departmentId") Integer departmentId);
}
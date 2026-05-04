package room911_project.repository;

import room911_project.model.AccessLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {

    // ── Para historial paginado ───────────────────────────────
    @Query("""
        SELECT l FROM AccessLog l
        WHERE (:employeeId IS NULL
               OR (l.employee IS NOT NULL
                   AND l.employee.id = :employeeId))
        AND l.accessedAt >= :start
        AND l.accessedAt <= :end
        ORDER BY l.accessedAt DESC
        """)
    Page<AccessLog> findLogsFiltered(
            @Param("employeeId") Integer employeeId,
            @Param("start") OffsetDateTime start,
            @Param("end")   OffsetDateTime end,
            Pageable pageable);

    // ── Para exportar PDF ─────────────────────────────────────
    @Query("""
        SELECT l FROM AccessLog l
        WHERE l.employee.id = :employeeId
        AND (:start IS NULL OR l.accessedAt >= :start)
        AND (:end   IS NULL OR l.accessedAt <= :end)
        ORDER BY l.accessedAt DESC
        """)
    List<AccessLog> findByEmployeeForPdf(
            @Param("employeeId") Integer employeeId,
            @Param("start") OffsetDateTime start,
            @Param("end")   OffsetDateTime end);

    // ── Para dashboard ────────────────────────────────────────
    @Query("""
        SELECT COUNT(l) FROM AccessLog l
        WHERE l.accessedAt > :since
        """)
    long countByAccessedAtAfter(@Param("since") OffsetDateTime since);

    @Query("""
        SELECT COUNT(l) FROM AccessLog l
        WHERE l.accessedAt >= :since
        AND l.result = room911_project.enums.AccessResult.GRANTED
        """)
    long countGrantedAfter(@Param("since") OffsetDateTime since);

    @Query("""
        SELECT COUNT(l) FROM AccessLog l
        WHERE l.accessedAt >= :since
        AND l.result <> room911_project.enums.AccessResult.GRANTED
        """)
    long countDeniedAfter(@Param("since") OffsetDateTime since);

    @Query("""
        SELECT COUNT(l) FROM AccessLog l
        WHERE l.accessedAt >= :since
        AND l.result = room911_project.enums.AccessResult.GRANTED
        AND l.employee IS NOT NULL
        AND l.employee.department.id = :departmentId
        """)
    long countGrantedByDepartment(
            @Param("since") OffsetDateTime since,
            @Param("departmentId") Integer departmentId);

    @Query("""
        SELECT COUNT(l) FROM AccessLog l
        WHERE l.accessedAt >= :since
        AND l.result <> room911_project.enums.AccessResult.GRANTED
        AND l.employee IS NOT NULL
        AND l.employee.department.id = :departmentId
        """)
    long countDeniedByDepartment(
            @Param("since") OffsetDateTime since,
            @Param("departmentId") Integer departmentId);
}
package room911_project.repository;

import room911_project.model.AdminActionLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.OffsetDateTime;
import java.util.UUID;

@Repository
public interface AdminActionLogRepository extends JpaRepository<AdminActionLog, Long> {

    @Query("""
        SELECT l FROM AdminActionLog l
        JOIN FETCH l.admin a
        WHERE (:adminId IS NULL OR a.id = :adminId)
        AND (:start IS NULL OR l.createdAt >= :start)
        AND (:end   IS NULL OR l.createdAt <= :end)
        ORDER BY l.createdAt DESC
        """)
    Page<AdminActionLog> findAuditFiltered(
            @Param("adminId") UUID adminId,
            @Param("start")   OffsetDateTime start,
            @Param("end")     OffsetDateTime end,
            Pageable pageable
    );
}
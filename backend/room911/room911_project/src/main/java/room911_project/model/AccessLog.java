package room911_project.model;

import room911_project.enums.AccessResult;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "access_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "internal_id_raw", nullable = false, length = 50)
    private String internalIdRaw;

    @Enumerated(EnumType.STRING)
    @Column(name = "result", nullable = false)
    private AccessResult result;

    @Column(name = "accessed_at", nullable = false)
    private OffsetDateTime accessedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}

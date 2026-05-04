package room911_project.model;

import room911_project.enums.AuditAction;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.OffsetDateTime;

@Entity
@Table(name = "admin_action_log")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminActionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false)
    private AuditAction actionType;

    @Column(name = "entity", nullable = false, length = 100)
    private String entity;

    @Column(name = "entity_id", length = 100)
    private String entityId;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
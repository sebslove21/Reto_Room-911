package room911_project.dto.response;

import lombok.*;
import java.time.OffsetDateTime;

@Data @Builder
public class AuditLogResponse {
    private Long id;
    private String adminId;
    private String adminName;
    private String actionType;
    private String entity;
    private String entityId;
    private String description;
    private OffsetDateTime createdAt;
}
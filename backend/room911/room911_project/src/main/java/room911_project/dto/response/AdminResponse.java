package room911_project.dto.response;

import lombok.*;
import java.time.OffsetDateTime;

@Data @Builder
public class AdminResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private Integer departmentId;
    private String departmentName;
    private Boolean isActive;
    private OffsetDateTime lastLoginAt;
    private String avatarUrl;
    private OffsetDateTime createdAt;
}
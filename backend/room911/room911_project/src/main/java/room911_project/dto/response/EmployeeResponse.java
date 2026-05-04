package room911_project.dto.response;

import lombok.*;
import java.time.OffsetDateTime;

@Data @Builder
public class EmployeeResponse {
    private Integer id;
    private String internalId;
    private String firstName;
    private String lastName;
    private String email;
    private Integer departmentId;
    private String departmentName;
    private Boolean hasAccess;
    private Boolean isActive;
    private Boolean isInside;
    private OffsetDateTime enteredAt;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
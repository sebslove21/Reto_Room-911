package room911_project.dto.response;

import lombok.*;
import java.time.OffsetDateTime;

@Data @Builder
public class EmployeePresenceResponse {
    private Integer id;
    private String internalId;
    private String firstName;
    private String lastName;
    private String departmentName;
    private OffsetDateTime enteredAt;
    private Long minutesInside;
    private String status;
}
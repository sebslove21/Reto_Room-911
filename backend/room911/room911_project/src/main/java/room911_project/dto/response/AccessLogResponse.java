package room911_project.dto.response;

import lombok.*;
import java.time.OffsetDateTime;

@Data @Builder
public class AccessLogResponse {
    private Long id;
    private Integer employeeId;
    private String internalIdRaw;
    private String employeeName;
    private String departmentName;
    private String result;
    private OffsetDateTime accessedAt;
    private String notes;
}
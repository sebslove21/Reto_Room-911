package room911_project.dto.response;

import lombok.*;

@Data @Builder
public class DepartmentStatsResponse {
    private Integer departmentId;
    private String departmentName;
    private Long totalAccesses;
    private Long grantedAccesses;
    private Long deniedAccesses;
    private Double percentage;
}
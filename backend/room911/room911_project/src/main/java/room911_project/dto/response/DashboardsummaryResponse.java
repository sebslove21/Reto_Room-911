package room911_project.dto.response;

import lombok.*;

@Data @Builder
public class DashboardSummaryResponse {
    private Long totalEmployees;
    private Long accessesToday;
    private Long currentOccupancy;
    private Integer maxCapacity;
    private Long deniedToday;
    private Long activeAdmins;
}
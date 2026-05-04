package room911_project.dto.response;

import lombok.*;
import java.util.List;

@Data @Builder
public class RoomStatusResponse {
    private Integer currentOccupancy;
    private Integer maxCapacity;
    private Integer maxStayMinutes;
    private Integer alertThresholdPct;
    private Integer occupancyPercentage;
    private List<EmployeePresenceResponse> employeesInside;
}
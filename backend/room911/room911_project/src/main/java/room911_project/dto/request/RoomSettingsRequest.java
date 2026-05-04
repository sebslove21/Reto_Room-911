package room911_project.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class RoomSettingsRequest {
    @Min(1) private Integer maxCapacity;
    @Min(1) private Integer maxStayMinutes;
    @Min(1) private Integer alertThresholdPct;
}
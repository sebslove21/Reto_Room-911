package room911_project.dto.request;

import jakarta.validation.constraints.Min;

public class RoomSettingsRequest {
    @Min(1) private Integer maxCapacity;
    @Min(1) private Integer maxStayMinutes;
    @Min(1) private Integer alertThresholdPct;


        public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

        public Integer getMaxStayMinutes() {
        return maxStayMinutes;
    }

    public void setMaxStayMinutes(Integer maxStayMinutes) {
        this.maxStayMinutes = maxStayMinutes;
    }

        public Integer getAlertThresholdPct() {
        return alertThresholdPct;
    }

    public void setAlertThresholdPct(Integer alertThresholdPct) {
        this.alertThresholdPct = alertThresholdPct;
    }
}
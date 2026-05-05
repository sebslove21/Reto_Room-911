package room911_project.dto.response;

import java.util.List;

 public class RoomStatusResponse {
    private Integer currentOccupancy;
    private Integer maxCapacity;
    private Integer maxStayMinutes;
    private Integer alertThresholdPct;
    private Integer occupancyPercentage;
    private List<EmployeePresenceResponse> employeesInside;


    public Integer getCurrentOccupancy() {
        return currentOccupancy;
    }

    public void setCurrentOccupancy(Integer currentOccupancy) {
        this.currentOccupancy = currentOccupancy;
    }

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

        public Integer getOccupancyPercentage() {
        return occupancyPercentage;
    }

    public void setOccupancyPercentage(Integer occupancyPercentage) {
        this.occupancyPercentage = occupancyPercentage;
    }

    public List<EmployeePresenceResponse> getEmployeesInside() {
        return employeesInside;
    }

    public void setEmployeesInside(List<EmployeePresenceResponse> employeesInside) {
        this.employeesInside = employeesInside;
    }

public static class Builder {
        private Integer currentOccupancy;
        private Integer maxCapacity;
        private Integer maxStayMinutes;
        private Integer alertThresholdPct;
        private Integer occupancyPercentage;
        private List<EmployeePresenceResponse> employeesInside;

        public Builder currentOccupancy(Integer currentOccupancy) {
            this.currentOccupancy = currentOccupancy;
            return this;
        }

        public Builder maxCapacity(Integer maxCapacity) {
            this.maxCapacity = maxCapacity;
            return this;
        }

        public Builder maxStayMinutes(Integer maxStayMinutes) {
            this.maxStayMinutes = maxStayMinutes;
            return this;
        }

        public Builder alertThresholdPct(Integer alertThresholdPct) {
            this.alertThresholdPct = alertThresholdPct;
            return this;
        }

        public Builder occupancyPercentage(Integer occupancyPercentage) {
            this.occupancyPercentage = occupancyPercentage;
            return this;
        }

        public Builder employeesInside(List<EmployeePresenceResponse> employeesInside) {
            this.employeesInside = employeesInside;
            return this;
        }

        public RoomStatusResponse build() {
            RoomStatusResponse obj = new RoomStatusResponse();
            obj.currentOccupancy = this.currentOccupancy;
            obj.maxCapacity = this.maxCapacity;
            obj.maxStayMinutes = this.maxStayMinutes;
            obj.alertThresholdPct = this.alertThresholdPct;
            obj.occupancyPercentage = this.occupancyPercentage;
            obj.employeesInside = this.employeesInside;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
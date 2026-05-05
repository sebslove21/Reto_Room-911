package room911_project.dto.response;

 public class DashboardSummaryResponse {
    private Long totalEmployees;
    private Long accessesToday;
    private Long currentOccupancy;
    private Integer maxCapacity;
    private Long deniedToday;
    private Long activeAdmins;


        public Long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(Long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

        public Long getAccessesToday() {
        return accessesToday;
    }

    public void setAccessesToday(Long accessesToday) {
        this.accessesToday = accessesToday;
    }

        public Long getCurrentOccupancy() {
        return currentOccupancy;
    }

    public void setCurrentOccupancy(Long currentOccupancy) {
        this.currentOccupancy = currentOccupancy;
    }

        public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

        public Long getDeniedToday() {
        return deniedToday;
    }

    public void setDeniedToday(Long deniedToday) {
        this.deniedToday = deniedToday;
    }

        public Long getActiveAdmins() {
        return activeAdmins;
    }

    public void setActiveAdmins(Long activeAdmins) {
        this.activeAdmins = activeAdmins;
    }


public static class Builder {
        private Long totalEmployees;
        private Long accessesToday;
        private Long currentOccupancy;
        private Integer maxCapacity;
        private Long deniedToday;
        private Long activeAdmins;

        public Builder totalEmployees(Long totalEmployees) {
            this.totalEmployees = totalEmployees;
            return this;
        }

        public Builder accessesToday(Long accessesToday) {
            this.accessesToday = accessesToday;
            return this;
        }

        public Builder currentOccupancy(Long currentOccupancy) {
            this.currentOccupancy = currentOccupancy;
            return this;
        }

        public Builder maxCapacity(Integer maxCapacity) {
            this.maxCapacity = maxCapacity;
            return this;
        }

        public Builder deniedToday(Long deniedToday) {
            this.deniedToday = deniedToday;
            return this;
        }

        public Builder activeAdmins(Long activeAdmins) {
            this.activeAdmins = activeAdmins;
            return this;
        }

        public DashboardSummaryResponse build() {
            DashboardSummaryResponse obj = new DashboardSummaryResponse();
            obj.totalEmployees = this.totalEmployees;
            obj.accessesToday = this.accessesToday;
            obj.currentOccupancy = this.currentOccupancy;
            obj.maxCapacity = this.maxCapacity;
            obj.deniedToday = this.deniedToday;
            obj.activeAdmins = this.activeAdmins;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
package room911_project.dto.response;

 public class DepartmentStatsResponse {
    private Integer departmentId;
    private String departmentName;
    private Long totalAccesses;
    private Long grantedAccesses;
    private Long deniedAccesses;
    private Double percentage;


        public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }

        public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

        public Long getTotalAccesses() {
        return totalAccesses;
    }

    public void setTotalAccesses(Long totalAccesses) {
        this.totalAccesses = totalAccesses;
    }

        public Long getGrantedAccesses() {
        return grantedAccesses;
    }

    public void setGrantedAccesses(Long grantedAccesses) {
        this.grantedAccesses = grantedAccesses;
    }

        public Long getDeniedAccesses() {
        return deniedAccesses;
    }

    public void setDeniedAccesses(Long deniedAccesses) {
        this.deniedAccesses = deniedAccesses;
    }

        public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }


public static class Builder {
        private Integer departmentId;
        private String departmentName;
        private Long totalAccesses;
        private Long grantedAccesses;
        private Long deniedAccesses;
        private Double percentage;

        public Builder departmentId(Integer departmentId) {
            this.departmentId = departmentId;
            return this;
        }

        public Builder departmentName(String departmentName) {
            this.departmentName = departmentName;
            return this;
        }

        public Builder totalAccesses(Long totalAccesses) {
            this.totalAccesses = totalAccesses;
            return this;
        }

        public Builder grantedAccesses(Long grantedAccesses) {
            this.grantedAccesses = grantedAccesses;
            return this;
        }

        public Builder deniedAccesses(Long deniedAccesses) {
            this.deniedAccesses = deniedAccesses;
            return this;
        }

        public Builder percentage(Double percentage) {
            this.percentage = percentage;
            return this;
        }

        public DepartmentStatsResponse build() {
            DepartmentStatsResponse obj = new DepartmentStatsResponse();
            obj.departmentId = this.departmentId;
            obj.departmentName = this.departmentName;
            obj.totalAccesses = this.totalAccesses;
            obj.grantedAccesses = this.grantedAccesses;
            obj.deniedAccesses = this.deniedAccesses;
            obj.percentage = this.percentage;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
package room911_project.dto.response;

import java.time.OffsetDateTime;

 public class AccessLogResponse {
    private Long id;
    private Integer employeeId;
    private String internalIdRaw;
    private String employeeName;
    private String departmentName;
    private String result;
    private OffsetDateTime accessedAt;
    private String notes;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

        public String getInternalIdRaw() {
        return internalIdRaw;
    }

    public void setInternalIdRaw(String internalIdRaw) {
        this.internalIdRaw = internalIdRaw;
    }

        public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

        public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

        public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

        public OffsetDateTime getAccessedAt() {
        return accessedAt;
    }

    public void setAccessedAt(OffsetDateTime accessedAt) {
        this.accessedAt = accessedAt;
    }

        public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


public static class Builder {
        private Long id;
        private Integer employeeId;
        private String internalIdRaw;
        private String employeeName;
        private String departmentName;
        private String result;
        private OffsetDateTime accessedAt;
        private String notes;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder employeeId(Integer employeeId) {
            this.employeeId = employeeId;
            return this;
        }

        public Builder internalIdRaw(String internalIdRaw) {
            this.internalIdRaw = internalIdRaw;
            return this;
        }

        public Builder employeeName(String employeeName) {
            this.employeeName = employeeName;
            return this;
        }

        public Builder departmentName(String departmentName) {
            this.departmentName = departmentName;
            return this;
        }

        public Builder result(String result) {
            this.result = result;
            return this;
        }

        public Builder accessedAt(OffsetDateTime accessedAt) {
            this.accessedAt = accessedAt;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public AccessLogResponse build() {
            AccessLogResponse obj = new AccessLogResponse();
            obj.id = this.id;
            obj.employeeId = this.employeeId;
            obj.internalIdRaw = this.internalIdRaw;
            obj.employeeName = this.employeeName;
            obj.departmentName = this.departmentName;
            obj.result = this.result;
            obj.accessedAt = this.accessedAt;
            obj.notes = this.notes;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
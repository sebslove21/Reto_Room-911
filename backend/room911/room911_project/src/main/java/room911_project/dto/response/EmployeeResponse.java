package room911_project.dto.response;

import java.time.OffsetDateTime;

 public class EmployeeResponse {
    private Integer id;
    private String internalId;
    private String firstName;
    private String lastName;
    private String email;
    private Integer departmentId;
    private String departmentName;
    private Boolean hasAccess;
    private Boolean isActive;
    private Boolean isInside;
    private OffsetDateTime enteredAt;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getInternalId() {
        return internalId;
    }

    public void setInternalId(String internalId) {
        this.internalId = internalId;
    }

        public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

        public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

        public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

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

        public Boolean getHasAccess() {
        return hasAccess;
    }

    public void setHasAccess(Boolean hasAccess) {
        this.hasAccess = hasAccess;
    }

        public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

        public Boolean getIsInside() {
        return isInside;
    }

    public void setIsInside(Boolean isInside) {
        this.isInside = isInside;
    }

        public OffsetDateTime getEnteredAt() {
        return enteredAt;
    }

    public void setEnteredAt(OffsetDateTime enteredAt) {
        this.enteredAt = enteredAt;
    }

        public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

        public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }


public static class Builder {
        private Integer id;
        private String internalId;
        private String firstName;
        private String lastName;
        private String email;
        private Integer departmentId;
        private String departmentName;
        private Boolean hasAccess;
        private Boolean isActive;
        private Boolean isInside;
        private OffsetDateTime enteredAt;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;

        public Builder id(Integer id) {
            this.id = id;
            return this;
        }

        public Builder internalId(String internalId) {
            this.internalId = internalId;
            return this;
        }

        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder departmentId(Integer departmentId) {
            this.departmentId = departmentId;
            return this;
        }

        public Builder departmentName(String departmentName) {
            this.departmentName = departmentName;
            return this;
        }

        public Builder hasAccess(Boolean hasAccess) {
            this.hasAccess = hasAccess;
            return this;
        }

        public Builder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public Builder isInside(Boolean isInside) {
            this.isInside = isInside;
            return this;
        }

        public Builder enteredAt(OffsetDateTime enteredAt) {
            this.enteredAt = enteredAt;
            return this;
        }

        public Builder createdAt(OffsetDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(OffsetDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public EmployeeResponse build() {
            EmployeeResponse obj = new EmployeeResponse();
            obj.id = this.id;
            obj.internalId = this.internalId;
            obj.firstName = this.firstName;
            obj.lastName = this.lastName;
            obj.email = this.email;
            obj.departmentId = this.departmentId;
            obj.departmentName = this.departmentName;
            obj.hasAccess = this.hasAccess;
            obj.isActive = this.isActive;
            obj.isInside = this.isInside;
            obj.enteredAt = this.enteredAt;
            obj.createdAt = this.createdAt;
            obj.updatedAt = this.updatedAt;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
package room911_project.dto.response;

import java.time.OffsetDateTime;

public class EmployeePresenceResponse {
    private Integer id;
    private String internalId;
    private String firstName;
    private String lastName;
    private String departmentName;
    private OffsetDateTime enteredAt;
    private Long minutesInside;
    private String status;


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

        public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

        public OffsetDateTime getEnteredAt() {
        return enteredAt;
    }

    public void setEnteredAt(OffsetDateTime enteredAt) {
        this.enteredAt = enteredAt;
    }

        public Long getMinutesInside() {
        return minutesInside;
    }

    public void setMinutesInside(Long minutesInside) {
        this.minutesInside = minutesInside;
    }

        public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


public static class Builder {
        private Integer id;
        private String internalId;
        private String firstName;
        private String lastName;
        private String departmentName;
        private OffsetDateTime enteredAt;
        private Long minutesInside;
        private String status;

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

        public Builder departmentName(String departmentName) {
            this.departmentName = departmentName;
            return this;
        }

        public Builder enteredAt(OffsetDateTime enteredAt) {
            this.enteredAt = enteredAt;
            return this;
        }

        public Builder minutesInside(Long minutesInside) {
            this.minutesInside = minutesInside;
            return this;
        }

        public Builder status(String status) {
            this.status = status;
            return this;
        }

        public EmployeePresenceResponse build() {
            EmployeePresenceResponse obj = new EmployeePresenceResponse();
            obj.id = this.id;
            obj.internalId = this.internalId;
            obj.firstName = this.firstName;
            obj.lastName = this.lastName;
            obj.departmentName = this.departmentName;
            obj.enteredAt = this.enteredAt;
            obj.minutesInside = this.minutesInside;
            obj.status = this.status;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
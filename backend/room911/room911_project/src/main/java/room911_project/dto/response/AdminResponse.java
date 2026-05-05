package room911_project.dto.response;

import java.time.OffsetDateTime;

 public class AdminResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private Integer departmentId;
    private String departmentName;
    private Boolean isActive;
    private OffsetDateTime lastLoginAt;
    private String avatarUrl;
    private OffsetDateTime createdAt;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

        public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
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

        public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

        public OffsetDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(OffsetDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

        public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

        public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }


public static class Builder {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
        private Integer departmentId;
        private String departmentName;
        private Boolean isActive;
        private OffsetDateTime lastLoginAt;
        private String avatarUrl;
        private OffsetDateTime createdAt;

        public Builder id(String id) {
            this.id = id;
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

        public Builder role(String role) {
            this.role = role;
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

        public Builder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public Builder lastLoginAt(OffsetDateTime lastLoginAt) {
            this.lastLoginAt = lastLoginAt;
            return this;
        }

        public Builder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public Builder createdAt(OffsetDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AdminResponse build() {
            AdminResponse obj = new AdminResponse();
            obj.id = this.id;
            obj.firstName = this.firstName;
            obj.lastName = this.lastName;
            obj.email = this.email;
            obj.role = this.role;
            obj.departmentId = this.departmentId;
            obj.departmentName = this.departmentName;
            obj.isActive = this.isActive;
            obj.lastLoginAt = this.lastLoginAt;
            obj.avatarUrl = this.avatarUrl;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
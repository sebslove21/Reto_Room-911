package room911_project.dto.response;

 public class AuthResponse {
    private String token;
    private String type;
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Integer departmentId;
    private String departmentName;
    private String avatarUrl;


        public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

        public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

        public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

        public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }


public static class Builder {
        private String token;
        private String type;
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private Integer departmentId;
        private String departmentName;
        private String avatarUrl;

        public Builder token(String token) {
            this.token = token;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
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

        public Builder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public AuthResponse build() {
            AuthResponse obj = new AuthResponse();
            obj.token = this.token;
            obj.type = this.type;
            obj.id = this.id;
            obj.email = this.email;
            obj.firstName = this.firstName;
            obj.lastName = this.lastName;
            obj.role = this.role;
            obj.departmentId = this.departmentId;
            obj.departmentName = this.departmentName;
            obj.avatarUrl = this.avatarUrl;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
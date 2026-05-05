package room911_project.dto.request;

import jakarta.validation.constraints.*;

public class ResetPasswordRequest {
    @NotBlank private String token;
    @NotBlank @Size(min = 8) private String newPassword;


        public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

        public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
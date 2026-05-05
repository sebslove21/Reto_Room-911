package room911_project.dto.request;

import jakarta.validation.constraints.*;

public class ForgotPasswordRequest {
    @NotBlank @Email private String email;


        public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
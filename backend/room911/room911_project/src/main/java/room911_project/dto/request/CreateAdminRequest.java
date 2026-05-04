package room911_project.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateAdminRequest {
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @NotBlank @Email private String email;
    @NotBlank @Size(min = 8) private String password;
    @NotNull private Integer departmentId;
}
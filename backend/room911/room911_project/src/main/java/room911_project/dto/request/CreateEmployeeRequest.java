package room911_project.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateEmployeeRequest {
    @NotBlank private String internalId;
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    @Email private String email;
    @NotNull private Integer departmentId;
}
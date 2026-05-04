package room911_project.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateEmployeeRequest {
    private String internalId;
    private String firstName;
    private String lastName;
    @Email private String email;
    private Integer departmentId;
    private Boolean hasAccess;
}
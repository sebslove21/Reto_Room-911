package room911_project.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccessValidateRequest {
    @NotBlank private String internalId;
}
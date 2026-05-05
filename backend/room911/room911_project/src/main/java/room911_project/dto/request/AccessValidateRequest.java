package room911_project.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AccessValidateRequest {
    @NotBlank private String internalId;


        public String getInternalId() {
        return internalId;
    }

    public void setInternalId(String internalId) {
        this.internalId = internalId;
    }
}
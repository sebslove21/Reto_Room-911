package room911_project.dto.response;

import lombok.*;

@Data @Builder
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
}
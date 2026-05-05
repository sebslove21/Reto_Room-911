package room911_project.dto.response;

import java.time.OffsetDateTime;

 public class AuditLogResponse {
    private Long id;
    private String adminId;
    private String adminName;
    private String actionType;
    private String entity;
    private String entityId;
    private String description;
    private OffsetDateTime createdAt;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

        public String getAdminName() {
        return adminName;
    }

    public void setAdminName(String adminName) {
        this.adminName = adminName;
    }

        public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

        public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

        public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

        public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

        public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }


public static class Builder {
        private Long id;
        private String adminId;
        private String adminName;
        private String actionType;
        private String entity;
        private String entityId;
        private String description;
        private OffsetDateTime createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder adminId(String adminId) {
            this.adminId = adminId;
            return this;
        }

        public Builder adminName(String adminName) {
            this.adminName = adminName;
            return this;
        }

        public Builder actionType(String actionType) {
            this.actionType = actionType;
            return this;
        }

        public Builder entity(String entity) {
            this.entity = entity;
            return this;
        }

        public Builder entityId(String entityId) {
            this.entityId = entityId;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder createdAt(OffsetDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AuditLogResponse build() {
            AuditLogResponse obj = new AuditLogResponse();
            obj.id = this.id;
            obj.adminId = this.adminId;
            obj.adminName = this.adminName;
            obj.actionType = this.actionType;
            obj.entity = this.entity;
            obj.entityId = this.entityId;
            obj.description = this.description;
            obj.createdAt = this.createdAt;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
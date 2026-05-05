package room911_project.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import room911_project.enums.AccessResult;

@Entity
@Table(name = "access_logs")
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "internal_id_raw", nullable = false, length = 50)
    private String internalIdRaw;

    @Enumerated(EnumType.STRING)
    @Column(name = "result", nullable = false)
    private AccessResult result;

    @Column(name = "accessed_at", nullable = false)
    private OffsetDateTime accessedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public AccessLog() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

        public String getInternalIdRaw() {
        return internalIdRaw;
    }

    public void setInternalIdRaw(String internalIdRaw) {
        this.internalIdRaw = internalIdRaw;
    }

        public AccessResult getResult() {
        return result;
    }

    public void setResult(AccessResult result) {
        this.result = result;
    }

        public OffsetDateTime getAccessedAt() {
        return accessedAt;
    }

    public void setAccessedAt(OffsetDateTime accessedAt) {
        this.accessedAt = accessedAt;
    }

        public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public static class Builder {
        private Long id;
        private Employee employee;
        private String internalIdRaw;
        private AccessResult result;
        private OffsetDateTime accessedAt;
        private String notes;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder employee(Employee employee) {
            this.employee = employee;
            return this;
        }

        public Builder internalIdRaw(String internalIdRaw) {
            this.internalIdRaw = internalIdRaw;
            return this;
        }

        public Builder result(AccessResult result) {
            this.result = result;
            return this;
        }

        public Builder accessedAt(OffsetDateTime accessedAt) {
            this.accessedAt = accessedAt;
            return this;
        }

        public Builder notes(String notes) {
            this.notes = notes;
            return this;
        }

        public AccessLog build() {
            AccessLog obj = new AccessLog();
            obj.id = this.id;
            obj.employee = this.employee;
            obj.internalIdRaw = this.internalIdRaw;
            obj.result = this.result;
            obj.accessedAt = this.accessedAt;
            obj.notes = this.notes;
            return obj;
        }
    }

    public static Builder builder() {
        return new Builder();
    }
}
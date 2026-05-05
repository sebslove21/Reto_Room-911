package room911_project.model;

import java.time.OffsetDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "room_settings")
public class RoomSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity = 10;

    @Column(name = "max_stay_minutes", nullable = false)
    private Integer maxStayMinutes = 60;

    @Column(name = "alert_threshold_pct", nullable = false)
    private Integer alertThresholdPct = 80;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;


            public RoomSettings() {}

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

        public Integer getMaxStayMinutes() {
        return maxStayMinutes;
    }

    public void setMaxStayMinutes(Integer maxStayMinutes) {
        this.maxStayMinutes = maxStayMinutes;
    }

        public Integer getAlertThresholdPct() {
        return alertThresholdPct;
    }

    public void setAlertThresholdPct(Integer alertThresholdPct) {
        this.alertThresholdPct = alertThresholdPct;
    }

        public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
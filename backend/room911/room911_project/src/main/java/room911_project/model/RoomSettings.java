package room911_project.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "room_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
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
}

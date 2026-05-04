package room911_project.repository;

import room911_project.model.RoomSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomSettingsRepository extends JpaRepository<RoomSettings, Integer> {
}
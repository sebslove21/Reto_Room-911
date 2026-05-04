package room911_project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Room911ProjectApplication {
    public static void main(String[] args) {
        SpringApplication.run(Room911ProjectApplication.class, args);
    }
}

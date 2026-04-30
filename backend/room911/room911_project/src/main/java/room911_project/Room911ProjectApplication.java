package room911_project;

import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackages = "room911_project")
public class Room911ProjectApplication {
    public static void main(String[] args) {
        SpringApplication.run(Room911ProjectApplication.class, args);
    }
}

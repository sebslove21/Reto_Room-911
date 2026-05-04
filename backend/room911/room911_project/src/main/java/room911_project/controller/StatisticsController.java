package room911_project.controller;

import room911_project.dto.response.DashboardSummaryResponse;
import room911_project.dto.response.DepartmentStatsResponse;
import room911_project.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(statisticsService.getSummary());
    }

    @GetMapping("/access-by-department")
    public ResponseEntity<List<DepartmentStatsResponse>> getByDepartment(
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(
                statisticsService.getByDepartment(period, startDate, endDate));
    }
}
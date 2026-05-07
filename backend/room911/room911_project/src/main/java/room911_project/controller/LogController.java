package room911_project.controller;

import room911_project.dto.response.AccessLogResponse;
import room911_project.service.LogService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    

    private final LogService logService;

    public LogController(LogService logService) {
        this.logService = logService;
    }

    @GetMapping("/all")
    public ResponseEntity<Page<AccessLogResponse>> getAll(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                logService.getLogsFiltered(null, startDate, endDate, page, size));
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<Page<AccessLogResponse>> getByEmployee(
            @PathVariable Integer id,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                logService.getLogsFiltered(id, startDate, endDate, page, size));
    }

    @GetMapping("/employee/{id}/export-pdf")
    public ResponseEntity<byte[]> exportPdf(
            @PathVariable Integer id,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) throws Exception {
        byte[] pdf = logService.exportPdf(id, startDate, endDate);
        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=historial_" + id + ".pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }

    @GetMapping("/export-pdf-all")
    public ResponseEntity<byte[]> exportAllPdf(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) throws Exception {
        byte[] pdf = logService.exportAllPdf(startDate, endDate);
        return ResponseEntity.ok()
                .header("Content-Disposition",
                        "attachment; filename=historial_todos_empleados.pdf")
                .header("Content-Type", "application/pdf")
                .body(pdf);
    }
}
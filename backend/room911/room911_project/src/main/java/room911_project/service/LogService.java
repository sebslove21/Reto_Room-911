package room911_project.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import room911_project.dto.response.AccessLogResponse;
import room911_project.model.*;
import room911_project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.ByteArrayOutputStream;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogService {

    private final AccessLogRepository accessLogRepository;
    private final EmployeeRepository  employeeRepository;

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    @Transactional(readOnly = true)
    public Page<AccessLogResponse> getLogsFiltered(
            Integer employeeId,
            String startDate,
            String endDate,
            int page,
            int size) {

        ZoneOffset tz = ZoneOffset.ofHours(-5);

        OffsetDateTime start = startDate != null
                ? LocalDate.parse(startDate)
                        .atStartOfDay().atOffset(tz)
                : LocalDate.of(1900, 1, 1)
                        .atStartOfDay().atOffset(tz);

        OffsetDateTime end = endDate != null
                ? LocalDate.parse(endDate)
                        .atTime(23, 59, 59).atOffset(tz)
                : LocalDate.of(9999, 12, 31)
                        .atTime(23, 59, 59)
                        .atOffset(tz);

        // ── Sin Sort — la query ya ordena por accessed_at DESC ──
        Pageable pageable = PageRequest.of(page, size);

        return accessLogRepository
                .findLogsFiltered(employeeId, start, end, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public byte[] exportPdf(Integer empId,
            String startDate, String endDate) throws Exception {

        Employee emp = employeeRepository.findById(empId)
                .orElseThrow(() -> new RuntimeException(
                        "Empleado no encontrado"));

        ZoneOffset tz = ZoneOffset.ofHours(-5);

        OffsetDateTime start = startDate != null
                ? LocalDate.parse(startDate)
                        .atStartOfDay().atOffset(tz)
                : null;

        OffsetDateTime end = endDate != null
                ? LocalDate.parse(endDate)
                        .atTime(23, 59, 59).atOffset(tz)
                : null;

        List<AccessLog> logs = accessLogRepository
                .findByEmployeeForPdf(empId, start, end);

        Document doc = new Document(PageSize.A4.rotate());
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(doc, baos);
        doc.open();

        Font tf = new Font(Font.FontFamily.HELVETICA, 16,
                Font.BOLD, BaseColor.DARK_GRAY);
        Font sf = new Font(Font.FontFamily.HELVETICA, 9);
        Font hf = new Font(Font.FontFamily.HELVETICA, 10,
                Font.BOLD, BaseColor.WHITE);
        Font cf = new Font(Font.FontFamily.HELVETICA, 9);

        doc.add(new Paragraph(
                "ROOM_911 — Historial de Accesos", tf));
        doc.add(new Paragraph("Laboratorios XYZ", sf));
        doc.add(new Paragraph(
                "Empleado: " + emp.getFirstName()
                + " " + emp.getLastName()
                + " | ID: " + emp.getInternalId()
                + " | Depto: " + (emp.getDepartment() != null
                        ? emp.getDepartment().getName() : "—"),
                sf));
        doc.add(new Paragraph(
                "Generado: " + OffsetDateTime.now().format(FMT), sf));
        doc.add(Chunk.NEWLINE);

        PdfPTable t = new PdfPTable(4);
        t.setWidthPercentage(100);
        t.setWidths(new float[]{15, 35, 25, 25});
        BaseColor blue = new BaseColor(13, 71, 161);

        for (String h : new String[]{
                "ID", "Fecha y Hora", "Resultado", "Notas"}) {
            PdfPCell c = new PdfPCell(new Phrase(h, hf));
            c.setBackgroundColor(blue);
            c.setPadding(6);
            t.addCell(c);
        }

        for (AccessLog log : logs) {
            t.addCell(new PdfPCell(
                    new Phrase(log.getInternalIdRaw(), cf)));
            t.addCell(new PdfPCell(new Phrase(
                    log.getAccessedAt() != null
                            ? log.getAccessedAt().format(FMT)
                            : "—", cf)));
            t.addCell(new PdfPCell(new Phrase(
                    translateResult(log.getResult().name()), cf)));
            t.addCell(new PdfPCell(new Phrase(
                    log.getNotes() != null
                            ? log.getNotes() : "—", cf)));
        }

        doc.add(t);
        doc.add(new Paragraph(
                "Total registros: " + logs.size(), sf));
        doc.close();
        return baos.toByteArray();
    }

    private String translateResult(String r) {
        return switch (r) {
            case "GRANTED"              -> "Permitido";
            case "DENIED_NO_PERMISSION" -> "Sin permiso";
            case "DENIED_NOT_FOUND"     -> "No registrado";
            case "DENIED_MAX_CAPACITY"  -> "Aforo máximo";
            default -> r;
        };
    }

    private AccessLogResponse toResponse(AccessLog log) {
        Employee emp = log.getEmployee();
        return AccessLogResponse.builder()
                .id(log.getId())
                .employeeId(emp != null ? emp.getId() : null)
                .internalIdRaw(log.getInternalIdRaw())
                .employeeName(emp != null
                        ? emp.getFirstName() + " " + emp.getLastName()
                        : null)
                .departmentName(emp != null
                        && emp.getDepartment() != null
                        ? emp.getDepartment().getName() : null)
                .result(log.getResult().name())
                .accessedAt(log.getAccessedAt())
                .notes(log.getNotes())
                .build();
    }
}
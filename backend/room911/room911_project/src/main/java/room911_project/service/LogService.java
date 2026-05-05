package room911_project.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import room911_project.dto.response.AccessLogResponse;
import room911_project.model.*;
import room911_project.repository.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.ByteArrayOutputStream;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class LogService {
    private static final Logger log = LoggerFactory.getLogger(LogService.class);

    private final AccessLogRepository accessLogRepository;
    private final EmployeeRepository  employeeRepository;
    public LogService(AccessLogRepository accessLogRepository, EmployeeRepository employeeRepository) {
        this.accessLogRepository = accessLogRepository;
        this.employeeRepository = employeeRepository;
    }

    private static final DateTimeFormatter FMT =
            DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    // Fechas extremas para cuando no hay filtro de fecha
    private static final OffsetDateTime DATE_MIN =
            LocalDate.of(2000, 1, 1).atStartOfDay().atOffset(ZoneOffset.ofHours(-5));
    private static final OffsetDateTime DATE_MAX =
            LocalDate.of(2099, 12, 31).atTime(23, 59, 59).atOffset(ZoneOffset.ofHours(-5));

    @Transactional(readOnly = true)
    public Page<AccessLogResponse> getLogsFiltered(
            Integer employeeId, String startDate, String endDate,
            int page, int size) {

        ZoneOffset tz = ZoneOffset.ofHours(-5);

        // Siempre pasar fechas reales — nunca null
        OffsetDateTime start = startDate != null
                ? LocalDate.parse(startDate).atStartOfDay().atOffset(tz)
                : DATE_MIN;

        OffsetDateTime end = endDate != null
                ? LocalDate.parse(endDate).atTime(23, 59, 59).atOffset(tz)
                : DATE_MAX;

        Pageable pageable = PageRequest.of(page, size);

        return accessLogRepository
                .findLogsFiltered(employeeId, start, end, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public byte[] exportPdf(Integer empId, String startDate, String endDate) {
        try {
            Employee emp = employeeRepository.findById(empId)
                    .orElseThrow(() -> new RuntimeException(
                            "Empleado no encontrado: " + empId));

            ZoneOffset tz = ZoneOffset.ofHours(-5);

            // Siempre pasar fechas reales — nunca null
            OffsetDateTime start = startDate != null
                    ? LocalDate.parse(startDate).atStartOfDay().atOffset(tz)
                    : DATE_MIN;
            OffsetDateTime end = endDate != null
                    ? LocalDate.parse(endDate).atTime(23, 59, 59).atOffset(tz)
                    : DATE_MAX;

            List<AccessLog> logs = accessLogRepository
                    .findByEmployeeForPdf(empId, start, end);
            log.info("Generando PDF para empleado {} con {} registros",
                    empId, logs.size());

            return buildPdf(emp, logs);

        } catch (Exception e) {
            log.error("Error generando PDF para empleado {}: {}",
                    empId, e.getMessage(), e);
            throw new RuntimeException(
                    "Error al generar el PDF: " + e.getMessage(), e);
        }
    }

    private byte[] buildPdf(Employee emp, List<AccessLog> logs) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4.rotate(), 30, 30, 40, 30);
        PdfWriter writer = PdfWriter.getInstance(doc, baos);
        doc.open();

        Font fontTitle  = new Font(Font.FontFamily.HELVETICA, 16,
                Font.BOLD, new BaseColor(13, 71, 161));
        Font fontSub    = new Font(Font.FontFamily.HELVETICA, 10,
                Font.NORMAL, BaseColor.DARK_GRAY);
        Font fontSmall  = new Font(Font.FontFamily.HELVETICA, 9,
                Font.NORMAL, new BaseColor(84, 110, 122));
        Font fontHeader = new Font(Font.FontFamily.HELVETICA, 10,
                Font.BOLD, BaseColor.WHITE);
        Font fontCell   = new Font(Font.FontFamily.HELVETICA, 9,
                Font.NORMAL, new BaseColor(26, 29, 41));

        // ── Encabezado ─────────────────────────────────────────────────────
        doc.add(new Paragraph("ROOM_911 — Historial de Accesos", fontTitle));
        doc.add(new Paragraph(
                "Laboratorios XYZ · Área de Producción de Medicamentos",
                fontSub));
        doc.add(Chunk.NEWLINE);

        // ── Info del empleado ───────────────────────────────────────────────
        String deptName = (emp.getDepartment() != null)
                ? emp.getDepartment().getName() : "—";
        PdfPTable info = new PdfPTable(2);
        info.setWidthPercentage(100);
        info.setWidths(new float[]{1, 1});
        info.setSpacingAfter(12);

        addInfoCell(info, "Empleado",
                emp.getFirstName() + " " + emp.getLastName(), fontSmall);
        addInfoCell(info, "ID Interno",
                emp.getInternalId(), fontSmall);
        addInfoCell(info, "Departamento", deptName, fontSmall);
        addInfoCell(info, "Generado",
                OffsetDateTime.now(ZoneOffset.ofHours(-5)).format(FMT),
                fontSmall);
        addInfoCell(info, "Total registros",
                String.valueOf(logs.size()), fontSmall);
        addInfoCell(info, "", "", fontSmall);

        doc.add(info);

        // ── Tabla de registros ──────────────────────────────────────────────
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{12, 22, 22, 22, 22});

        BaseColor headerBg = new BaseColor(13, 71, 161);
        for (String h : new String[]{
                "ID", "Fecha y Hora", "Resultado", "Notas", "Departamento"}) {
            PdfPCell cell = new PdfPCell(new Phrase(h, fontHeader));
            cell.setBackgroundColor(headerBg);
            cell.setPadding(7);
            cell.setBorderColor(headerBg);
            table.addCell(cell);
        }

        boolean odd = false;
        BaseColor rowAlt = new BaseColor(245, 247, 250);

        for (AccessLog log : logs) {
            BaseColor rowBg = odd ? rowAlt : BaseColor.WHITE;
            odd = !odd;

            addTableCell(table, log.getInternalIdRaw(), fontCell, rowBg);
            addTableCell(table,
                    log.getAccessedAt() != null
                            ? log.getAccessedAt().format(FMT) : "—",
                    fontCell, rowBg);
            addTableCell(table,
                    translateResult(log.getResult().name()),
                    fontCell, rowBg);
            addTableCell(table,
                    log.getNotes() != null ? log.getNotes() : "—",
                    fontCell, rowBg);
            addTableCell(table,
                    (log.getEmployee() != null
                            && log.getEmployee().getDepartment() != null)
                            ? log.getEmployee().getDepartment().getName()
                            : "—",
                    fontCell, rowBg);
        }

        if (logs.isEmpty()) {
            PdfPCell empty = new PdfPCell(new Phrase(
                    "Sin registros en el período seleccionado",
                    fontSmall));
            empty.setColspan(5);
            empty.setPadding(12);
            empty.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(empty);
        }

        doc.add(table);
        doc.add(Chunk.NEWLINE);

        Paragraph footer = new Paragraph(
                "Documento generado por ROOM_911 — Laboratorios XYZ · "
                + OffsetDateTime.now(ZoneOffset.ofHours(-5)).format(FMT),
                new Font(Font.FontFamily.HELVETICA, 8,
                        Font.ITALIC, BaseColor.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        doc.add(footer);

        doc.close();
        writer.close();
        return baos.toByteArray();
    }

    private void addInfoCell(PdfPTable t, String label,
            String value, Font font) {
        Font lf = new Font(Font.FontFamily.HELVETICA, 9,
                Font.BOLD, new BaseColor(84, 110, 122));
        PdfPCell c = new PdfPCell();
        c.setBorder(Rectangle.NO_BORDER);
        c.setPadding(4);
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + ": ", lf));
        p.add(new Chunk(value, font));
        c.addElement(p);
        t.addCell(c);
    }

    private void addTableCell(PdfPTable t, String value,
            Font font, BaseColor bg) {
        PdfPCell c = new PdfPCell(new Phrase(value, font));
        c.setBackgroundColor(bg);
        c.setPadding(6);
        c.setBorderColor(new BaseColor(224, 224, 224));
        t.addCell(c);
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
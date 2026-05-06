¡Claro que sí! He extraído la información clave de tu documento de arquitectura
(ROOM911_Arquitectura_v1 (1).docx) y la he organizado para que puedas copiarla y
pegarla directamente en un documento de Word con un formato profesional.

DOCUMENTACIÓN TÉCNICA: ARQUITECTURA DEL SISTEMA
ROOM_911

Proyecto: Control de Acceso a Área de Producción – Laboratorios XYZ Autor: Sebastian
Zapata Herrera Tecnologías: Spring Boot (Java) & React.js

1. Resumen del Sistema

El sistema ROOM_911 es una plataforma web diseñada para controlar y auditar el acceso al
área de producción de medicamentos. Utiliza un patrón de diseño
Modelo–Vista–Controlador (MVC) desacoplado en dos capas principales:

●  Backend: Java Spring Boot (Lógica y persistencia).
●  Frontend: React.js (Interfaz de usuario SPA).
●  Base de Datos: PostgreSQL (Persistencia relacional).

2. Stack Tecnológico Principal

A continuación se detallan las tecnologías seleccionadas y su justificación técnica:

●  Backend Framework: Spring Boot 3.x – Por su madurez en APIs REST y seguridad

integrada.

●  Frontend Library: React.js 18 – Por su modelo de componentes reutilizables y

eficiencia.

●  Seguridad: JWT (JSON Web Token) + BCrypt – Para autenticación stateless y

encriptación de contraseñas.

●  Comunicación en Tiempo Real: WebSocket + STOMP – Permite el monitoreo de

presencia sin recargar la página.

●  Acceso a Datos: Hibernate + Spring Data JPA – Abstracción del dialecto SQL y

facilidad de mantenimiento.

3. Módulos de la Capa de Presentación (React)

Módulo

Responsabilidad

Comunicación

Auth Module

Login y recuperación de contraseña.

POST /api/auth/*

Employee
Module

CRUD de empleados y carga de archivos
CSV.

/api/employees

Access
Simulator

Real-Time
Monitor

Simulación del escáner de carnet físico.

POST
/api/access/validate

Panel dinámico de presencia actual.

WS ws/room-monitor

Statistics

Gráficas de accesos y reportes.

GET /api/statistics/*

4. Atributos de Calidad

●  Seguridad: Implementación de RBAC (Control de acceso basado en roles) con roles

ROLE_ADMIN y ROLE_SUPER_ADMIN.

●  Escalabilidad: Separación total de capas que permite el escalado horizontal

independiente del backend y frontend.

●  Disponibilidad: Manejo centralizado de excepciones y validaciones en doble capa

(frontend/backend).

●  Rendimiento: Paginación obligatoria y uso de índices B-tree en la base de datos

para consultas de gran volumen.

5. Registro de Decisiones Arquitectónicas (ADR)

●  ADR-04 (JWT): Se eligió JWT sobre sesiones tradicionales por ser compatible con

escalado horizontal y APIs stateless.

●  ADR-05 (WebSocket): Se implementó para reducir la latencia de actualización en el

monitor de segundos a milisegundos.

●  ADR-07 (AOP): Uso de Programación Orientada a Aspectos para centralizar la

auditoría administrativa sin modificar la lógica de negocio.

6. Modelo de Datos (Diagrama Entidad-Relación)

Nota: Aquí es donde debes insertar la imagen de las tablas que ya tienes en pgAdmin.

El diseño de la base de datos sigue una normalización de tercera forma (3NF) para
garantizar la integridad de los datos. Las relaciones principales son:

●  One-to-Many: Un department tiene muchos employees.
●  One-to-Many: Un employee genera múltiples access_logs.
●  One-to-Many: Un admin puede actualizar las room_settings y generar registros en

el admin_action_log.

7. Flujo de Validación de Acceso (Lógica de Negocio)

Este es el proceso que ocurre cada vez que un empleado intenta entrar:

1.  Captura: El simulador envía el internal_id al backend.
2.  Identificación: Se busca al empleado en la tabla employees.
○  Si no existe: Se registra DENIED_NOT_FOUND.
3.  Verificación de Permisos: Se revisa la columna has_access.

○  Si es falso: Se registra DENIED_NO_PERMISSION.

4.  Control de Aforo: El sistema consulta room_settings y cuenta cuántos empleados

tienen is_inside = TRUE.

○  Si el aforo está lleno: Se registra DENIED_MAX_CAPACITY.

5.  Concesión: Si todo es correcto, se registra GRANTED, se cambia is_inside a TRUE

y se actualiza entered_at.

8. Seguridad y Autenticación

El sistema protege los recursos mediante:

●  Encriptación: Las contraseñas de los administradores nunca se guardan en texto
plano; se utiliza el algoritmo BCrypt antes de almacenarlas en la tabla admins.
●  Tokens: Cada vez que un administrador entra, el servidor firma un JWT. El frontend
de React debe enviar este token en el encabezado Authorization de cada petición.
●  CORS: Configurado específicamente para permitir peticiones únicamente desde el

dominio del frontend, evitando ataques externos.

9. Casos de Uso Principales

Actor

Caso de Uso

Descripción

Admin

Gestión de
Personal

Crear, editar y dar de baja empleados o
departamentos.

Admin

Configuración de
Sala

Ajustar el límite de personas permitidas en el área.

Sistema

Monitoreo
Real-Time

Actualizar el panel de control vía WebSockets al
detectar un ingreso.

Super
Admin

Auditoría

Revisar el admin_action_log para ver quién modificó
la configuración.

10. Conclusiones y Trabajo Futuro

●  Conclusión: La arquitectura desacoplada permite que el sistema sea rápido y
seguro, cumpliendo con los estándares de calidad para entornos industriales.
●  Trabajo Futuro: Se planea la integración de biometría facial y la generación de
reportes automáticos en PDF enviados por correo electrónico a los jefes de
departamento.


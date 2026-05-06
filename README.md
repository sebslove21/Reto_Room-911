# ROOM_911

**Sistema de gestión de acceso y monitoreo de laboratorios**

## Descripción

ROOM_911 es una plataforma integral para el control de ingresos y auditoría de personal en áreas restringidas. El sistema permite la gestión de departamentos, el registro de empleados y el monitoreo en tiempo real de los accesos a los laboratorios.

## Tecnologías Utilizadas

* **Servidor (Backend):** Java 17, Spring Boot 3, Spring Data JPA, Hibernate.
* **Base de Datos:** PostgreSQL.
* **Cliente (Frontend):** React 18, TypeScript, Vite.
* **Gestión de Dependencias:** pnpm (Frontend), Maven (Backend).
* **Control de Versiones:** Git y GitHub.

## Estructura del Repositorio

* `/backend`: Contiene la lógica de negocio, controladores REST y configuración de persistencia.
* `/frontend`: Contiene la interfaz de usuario desarrollada como una Single Page Application (SPA).
* `/docs`: Documentación técnica, diagramas de arquitectura y guías de configuración.

## Configuración del Entorno

### Requisitos Previos

1. Java Development Kit (JDK) 17 o superior.
2. Node.js y gestor de paquetes pnpm.
3. Instancia de PostgreSQL en ejecución.
4. Git configurado globalmente.

### Instalación

1. **Clonación del repositorio:**
   **Bash**

   ```
   git clone https://github.com/sebslove21/Reto_Room-911.git
   cd Reto_Room-911
   ```
2. **Base de Datos:**

   * Crear una base de datos denominada `room_911_db`.
   * Configurar el usuario y contraseña en `backend/src/main/resources/application.properties`.
3. **Ejecución del Backend:**
   **Bash**

   ```
   cd backend
   ./mvnw spring-boot:run
   ```
4. **Ejecución del Frontend:**
   **Bash**

   ```
   cd frontend
   pnpm install
   pnpm run dev
   ```

## Flujo de Trabajo para Sincronización (Multi-equipo)

Para mantener la integridad del código entre diferentes estaciones de trabajo (Fedora/Windows 11):

* **Al iniciar la jornada:** Ejecutar `git pull origin main` para obtener las actualizaciones más recientes.
* **Al finalizar la jornada:** Ejecutar la secuencia `git add .`, `git commit` y `git push origin main` para asegurar que el progreso esté disponible en el repositorio remoto.

## Documentación Adicional

Los detalles específicos sobre el diseño de la base de datos, manuales de usuario y protocolos de seguridad se encuentran en la carpeta `/docs`.

## Créditos

Desarrollado por Sebastian Zapata Herrera.

---

### Instrucciones de guardado

1. Crea el archivo `README.md` en la raíz de tu proyecto.
2. Pega el texto anterior.
3. En tu terminal, ejecuta los siguientes comandos para actualizar el repositorio:
   **Bash**

   ```
   git add README.md
   git commit -m "docs: add professional README without emojis"
   git push origin main
   ```

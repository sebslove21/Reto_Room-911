**ROOM\_911**

Sistema de Control de Acceso

**HISTORIAS DE USUARIO · CATÁLOGO DE REQUISITOS FUNCIONALES Y NO FUNCIONALES**

*Laboratorios XYZ — Área de Producción de Medicamentos de Alto Costo*

Versión 1.0 | 2025

**Stack Tecnológico: Java Spring Boot · React.js · PostgreSQL · WebSockets · JWT**

**TABLA DE CONTENIDO**

**MÓDULO 1** Autenticación y Gestión de Usuarios Admin **· HU-01 – HU-03**

**MÓDULO 2** Gestión de Empleados **· HU-04 – HU-07**

**MÓDULO 3** Control de Acceso y Simulador **· HU-08 – HU-09**

**MÓDULO 4** Auditoría y Reportes **· HU-10 – HU-12**

**MÓDULO 5** Monitoreo en Tiempo Real **· HU-13 – HU-14**

**MÓDULO 6** Super Administrador **· HU-15 – HU-18**

**MÓDULO 7** Configuración Personal (Admin y Super Admin) **· HU-19 – HU-20**

**MÓDULO 8** Dashboard de Analítica **· HU-21**

**MÓDULO 9** Seguridad y Recuperación **· HU-22**

**CATÁLOGO** Requerimientos Funcionales (RF)

**CATÁLOGO** Requerimientos No Funcionales (RNF)

**MÓDULO 1 – Autenticación y Gestión de Usuarios Admin**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-01** | | | |
| **Nombre:** Inicio de sesión de administrador | | | |
| **Complejidad:** Media | **HU Relacionada:** N/A | **Módulo:** Módulo 1 – Autenticación y Gestión de Usuarios Admin | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del sistema**  Requiero poder autenticarme con usuario y contraseña  Para acceder de forma segura a las funcionalidades administrativas del sistema.  **Requerimiento:** RF-01: El sistema debe proteger el acceso mediante credenciales válidas. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador tiene credenciales válidas registradas en el sistema. | Ingresa su usuario y contraseña correctos y presiona "Iniciar sesión". | El sistema valida las credenciales, genera un token JWT y redirige al dashboard correspondiente a su rol. |
| **Condición 02** | El administrador ingresa una contraseña incorrecta. | Presiona "Iniciar sesión". | El sistema muestra el mensaje "Credenciales inválidas" sin revelar cuál campo es incorrecto. |
| **Condición 03** | El administrador deja campos vacíos. | Presiona "Iniciar sesión". | El sistema resalta los campos requeridos con mensajes de validación. |
| **Condición 04** | El token JWT del administrador ha expirado. | Intenta acceder a una ruta protegida. | El sistema redirige automáticamente al login con el mensaje "Sesión expirada". |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Diseñar pantalla de login en React con campos usuario, contraseña y botón de acceso. | | |
| **2** | Implementar endpoint POST /api/auth/login en Spring Boot con Spring Security. | | |
| **3** | Configurar JWT para generación y validación de sesiones con expiración configurable. | | |
| **4** | Implementar filtro de autenticación en el backend para rutas protegidas. | | |
| **5** | Agregar manejo de errores y mensajes de validación en el frontend. | | |
| **6** | Redirigir según rol: admin\_room\_911 → Dashboard Admin, super\_admin → Dashboard Super Admin. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-02** | | | |
| **Nombre:** Crear usuario administrador (por Super Admin) | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-01, HU-15 | **Módulo:** Módulo 1 – Autenticación y Gestión de Usuarios Admin | |
| **DESCRIPCIÓN** | | | |
| Yo como **Super Administrador**  Requiero poder crear nuevos usuarios administradores asignados a un departamento  Para delegar la gestión de accesos al ROOM\_911 a responsables de cada área.  **Requerimiento:** RF-02: El sistema debe permitir crear usuarios tipo admin\_room\_911 con asignación de departamento. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El Super Admin completa el formulario con datos válidos (nombre, apellido, email, contraseña, departamento). | Presiona "Crear administrador". | El sistema guarda el usuario con contraseña encriptada (bcrypt), rol admin\_room\_911 y departamento asignado, y envía credenciales por correo. |
| **Condición 02** | El Super Admin ingresa un email ya registrado. | Presiona "Crear administrador". | El sistema muestra "El email ya está en uso" sin crear el registro duplicado. |
| **Condición 03** | Las contraseñas no coinciden. | El Super Admin intenta crear el usuario. | El sistema resalta el campo de confirmación con el mensaje "Las contraseñas no coinciden". |
| **Condición 04** | El nuevo administrador fue creado exitosamente. | El nuevo administrador inicia sesión. | El sistema autentica correctamente al usuario y le muestra únicamente los empleados de su departamento asignado. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear formulario React para registro de administrador con selector de departamento. | | |
| **2** | Implementar endpoint POST /api/admin/users en Spring Boot con validación de rol. | | |
| **3** | Agregar validación de unicidad de email en capa de servicio. | | |
| **4** | Configurar encriptación de contraseña con BCryptPasswordEncoder. | | |
| **5** | Configurar envío de correo de bienvenida con credenciales temporales mediante SMTP. | | |
| **6** | Implementar listado de administradores existentes con opciones de edición y desactivación. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-03** | | | |
| **Nombre:** Editar y desactivar usuario administrador | | | |
| **Complejidad:** Baja | **HU Relacionada:** HU-02, HU-15 | **Módulo:** Módulo 1 – Autenticación y Gestión de Usuarios Admin | |
| **DESCRIPCIÓN** | | | |
| Yo como **Super Administrador**  Requiero poder editar los datos de un administrador y desactivar su cuenta  Para mantener la información actualizada y revocar accesos cuando un administrador deja el cargo.  **Requerimiento:** RF-03: El sistema debe permitir editar y desactivar cuentas de administradores. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El Super Admin edita nombre, apellido o departamento de un administrador. | Guarda los cambios. | El sistema actualiza los datos y registra la acción en el log de auditoría administrativa. |
| **Condición 02** | El Super Admin desactiva la cuenta de un administrador. | Confirma la acción. | El sistema marca la cuenta como inactiva y cierra cualquier sesión activa de ese usuario. |
| **Condición 03** | El administrador desactivado intenta iniciar sesión. | Ingresa sus credenciales. | El sistema muestra el mensaje "Cuenta desactivada. Contacte al Super Administrador". |
| **Condición 04** | El Super Admin cambia el departamento asignado de un administrador. | Guarda el cambio. | El administrador solo verá los empleados del nuevo departamento asignado al iniciar sesión. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear formulario React de edición de administrador precargado con datos actuales. | | |
| **2** | Implementar endpoint PUT /api/admin/users/{id} con validación de permisos. | | |
| **3** | Agregar campo activo/inactivo con confirmación modal antes de desactivar. | | |
| **4** | Implementar invalidación de token JWT activo al desactivar cuenta. | | |
| **5** | Registrar cambios en tabla admin\_action\_log con usuario que realizó la acción. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**MÓDULO 2 – Gestión de Empleados**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-04** | | | |
| **Nombre:** Registrar empleado individualmente | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-01 | **Módulo:** Módulo 2 – Gestión de Empleados | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del módulo**  Requiero poder registrar un nuevo empleado con sus datos básicos y asignarlo a un departamento  Para tener un registro completo del personal que puede solicitar acceso al ROOM\_911.  **Requerimiento:** RF-04: El sistema debe permitir registrar empleados con datos básicos y departamento asignado. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador llena todos los campos obligatorios: ID interno, nombre, apellido, email, departamento. | Presiona "Registrar empleado". | El sistema guarda el empleado con acceso deshabilitado por defecto y muestra confirmación de éxito. |
| **Condición 02** | El número de identificación interno ya existe en el sistema. | El administrador intenta guardar. | El sistema muestra "El ID de empleado ya está registrado" y no crea el duplicado. |
| **Condición 03** | El administrador deja campos obligatorios vacíos. | Intenta guardar. | El sistema resalta los campos faltantes y no envía el formulario. |
| **Condición 04** | El empleado es registrado correctamente. | El administrador consulta la lista de empleados. | El nuevo empleado aparece en la lista con todos sus datos y estado de acceso visible. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear formulario React para registro de empleado con validaciones en tiempo real. | | |
| **2** | Implementar endpoint POST /api/employees en Spring Boot. | | |
| **3** | Crear entidad Employee con JPA/Hibernate mapeada a la tabla employees en PostgreSQL. | | |
| **4** | Implementar validación de unicidad del ID interno en capa de servicio. | | |
| **5** | Cargar dinámicamente los departamentos desde la base de datos (solo los del admin logueado). | | |
| **6** | Agregar campo de estado de acceso con valor por defecto false. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-05** | | | |
| **Nombre:** Carga masiva de empleados por CSV | | | |
| **Complejidad:** Alta | **HU Relacionada:** HU-04 | **Módulo:** Módulo 2 – Gestión de Empleados | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del módulo**  Requiero poder cargar múltiples empleados a un departamento mediante un archivo CSV  Para agilizar el proceso de incorporación masiva de personal sin tener que registrar uno por uno.  **Requerimiento:** RF-05: El sistema debe soportar carga masiva de empleados desde archivo CSV. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador selecciona un CSV con formato válido y departamento destino. | Presiona "Cargar archivo". | El sistema procesa todos los registros y muestra un resumen: total cargados, duplicados omitidos y errores. |
| **Condición 02** | El CSV contiene IDs duplicados ya existentes en BD. | Se procesa el archivo. | El sistema omite los duplicados, carga los nuevos y reporta cuántos fueron omitidos con sus IDs. |
| **Condición 03** | El CSV tiene un formato incorrecto o columnas faltantes. | Se intenta procesar. | El sistema muestra el error de formato antes de procesar cualquier registro y provee el formato esperado. |
| **Condición 04** | La carga masiva finaliza exitosamente. | El administrador consulta el departamento destino. | Todos los empleados del CSV aparecen registrados con acceso deshabilitado por defecto. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear componente React para upload de archivo CSV con drag-and-drop y preview. | | |
| **2** | Implementar endpoint POST /api/employees/import con MultipartFile en Spring Boot. | | |
| **3** | Integrar librería OpenCSV para parseo del archivo con validación fila por fila. | | |
| **4** | Implementar lógica de validación con acumulación de errores y batch insert transaccional. | | |
| **5** | Diseñar y mostrar reporte de resultados de importación en modal React. | | |
| **6** | Proveer plantilla CSV descargable con los campos esperados. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-06** | | | |
| **Nombre:** Editar información de empleado | | | |
| **Complejidad:** Baja | **HU Relacionada:** HU-04 | **Módulo:** Módulo 2 – Gestión de Empleados | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del módulo**  Requiero poder editar los datos básicos de un empleado y cambiar su estado de acceso al ROOM\_911  Para mantener actualizada la información del personal y controlar quién puede acceder al área.  **Requerimiento:** RF-06: El sistema debe permitir editar información del empleado incluyendo su permiso de acceso. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador modifica nombre, apellido o departamento de un empleado. | Guarda los cambios. | El sistema actualiza los datos y muestra confirmación; el histórico de accesos no se modifica. |
| **Condición 02** | El administrador cambia el estado de acceso de Habilitado a Denegado. | Guarda los cambios. | El sistema actualiza el estado y el empleado no podrá acceder al ROOM\_911 en el siguiente intento. |
| **Condición 03** | El administrador intenta cambiar el ID interno a uno ya existente. | Guarda los cambios. | El sistema rechaza el cambio y muestra "El ID ya pertenece a otro empleado". |
| **Condición 04** | El administrador habilita el acceso de un empleado previamente denegado. | El empleado intenta acceder al ROOM\_911. | El sistema permite la entrada y registra el acceso exitoso en el histórico. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Implementar formulario de edición React precargado con datos del empleado seleccionado. | | |
| **2** | Crear endpoint PUT /api/employees/{id} en Spring Boot. | | |
| **3** | Agregar toggle visual (switch) para el estado de acceso al ROOM\_911. | | |
| **4** | Validar unicidad del ID interno al editar excluyendo el registro actual. | | |
| **5** | Implementar confirmación modal antes de cambiar estado de acceso. | | |
| **6** | Agregar auditoría de cambios: registrar quién y cuándo modificó el estado de acceso. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-07** | | | |
| **Nombre:** Buscar y filtrar empleados | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-04, HU-06 | **Módulo:** Módulo 2 – Gestión de Empleados | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del módulo**  Requiero poder buscar empleados por ID, nombre o apellido, y filtrar la lista por departamento  Para localizar rápidamente registros de empleados sin tener que navegar toda la lista.  **Requerimiento:** RF-07: El sistema debe proveer búsqueda y filtrado de empleados. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador ingresa un texto en el buscador. | Se realiza la búsqueda. | El sistema retorna empleados cuyo ID, nombre o apellido contenga el texto (búsqueda insensible a mayúsculas). |
| **Condición 02** | El administrador selecciona un departamento en el filtro. | Se aplica el filtro. | La lista muestra únicamente empleados pertenecientes al departamento seleccionado. |
| **Condición 03** | Se combinan búsqueda de texto y filtro de departamento. | Se aplican ambos criterios. | El sistema aplica ambos filtros simultáneamente y muestra los resultados que cumplen ambas condiciones. |
| **Condición 04** | No existe ningún empleado que coincida con los criterios. | Se aplica la búsqueda. | El sistema muestra el mensaje "No se encontraron empleados con los criterios indicados". |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Implementar barra de búsqueda con debounce en React para evitar exceso de requests. | | |
| **2** | Crear dropdown de filtro por departamento obtenido dinámicamente desde la API. | | |
| **3** | Implementar endpoint GET /api/employees con parámetros query: search, departmentId, page, size. | | |
| **4** | Agregar consulta JPA Specification con condiciones dinámicas. | | |
| **5** | Implementar paginación en la tabla de resultados. | | |
| **6** | Agregar indicador visual de filtros activos con opción de limpiar. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**MÓDULO 3 – Control de Acceso y Simulador**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-08** | | | |
| **Nombre:** Simulador de escáner de carnet | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-04 | **Módulo:** Módulo 3 – Control de Acceso y Simulador | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del módulo**  Requiero un formulario de simulación que reciba el número de identificación interno  Para validar la entrada al ROOM\_911 y registrar el éxito o fallo del intento.  **Requerimiento:** RF-08: El sistema debe validar el estado del empleado (Autorizado/Denegado) y registrar el intento. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | Un trabajador inserta su carnet corporativo (simulado mediante ingreso de ID en formulario). | El número de identificación interno es procesado. | El sistema evalúa si el empleado existe y si tiene acceso otorgado o denegado. |
| **Condición 02** | El empleado tiene acceso habilitado al ROOM\_911. | El sistema procesa su ID. | El sistema permite la entrada, muestra confirmación visual en verde y guarda un record con fecha, hora, ID y resultado "Exitoso". |
| **Condición 03** | El empleado tiene acceso denegado. | El sistema identifica que el permiso fue revocado. | El sistema deniega la entrada, muestra alerta en rojo y guarda un record con resultado "Denegado - Sin permiso". |
| **Condición 04** | El ID ingresado no existe en el sistema. | No coincide con ningún registro de la base de datos. | El sistema deniega el acceso y guarda el record indicando "Empleado no registrado". |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear interfaz de usuario para el formulario de simulación de carnet con feedback visual inmediato. | | |
| **2** | Implementar endpoint POST /api/access/validate en Spring Boot. | | |
| **3** | Desarrollar lógica de validación: existencia, permiso y aforo máximo. | | |
| **4** | Configurar captura automática del timestamp para cada record de acceso. | | |
| **5** | Emitir evento WebSocket al registrar un acceso para actualizar el monitor en tiempo real. | | |
| **6** | Realizar pruebas unitarias para los tres escenarios: éxito, fallo y usuario inexistente. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-09** | | | |
| **Nombre:** Registro de aforo actual del ROOM\_911 | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-08, HU-13 | **Módulo:** Módulo 3 – Control de Acceso y Simulador | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del módulo**  Requiero que el sistema controle automáticamente las entradas y salidas del ROOM\_911 para calcular el aforo actual  Para garantizar que nunca se supere el límite de personas permitidas dentro del área.  **Requerimiento:** RF-09: El sistema debe gestionar entradas y salidas para calcular el aforo en tiempo real. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | Un empleado intenta acceder y el aforo está al máximo permitido. | El sistema valida la entrada. | El sistema deniega el acceso, muestra "Aforo máximo alcanzado" y registra el intento. |
| **Condición 02** | Un empleado activa el escáner al salir (segundo escaneo). | El sistema procesa el ID. | El sistema registra la salida, actualiza el aforo y emite el evento al monitor en tiempo real. |
| **Condición 03** | El administrador modifica el límite de aforo en la configuración. | Guarda el cambio. | El nuevo límite se aplica inmediatamente en las siguientes validaciones de acceso. |
| **Condición 04** | El aforo actual llega al 80% del máximo. | Entra otro empleado. | El monitor muestra una alerta visual de advertencia sin bloquear el acceso. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Agregar campo is\_inside y entry\_time en la tabla de empleados o en una tabla de presencia. | | |
| **2** | Implementar lógica de toggle entrada/salida en el endpoint de validación. | | |
| **3** | Crear endpoint GET /api/room/status para consultar aforo actual. | | |
| **4** | Emitir evento WebSocket room.capacity.update al cambiar el aforo. | | |
| **5** | Implementar validación de límite de aforo desde tabla room\_settings. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**MÓDULO 4 – Auditoría y Reportes**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-10** | | | |
| **Nombre:** Consulta de historial de accesos de un empleado | | | |
| **Complejidad:** Baja | **HU Relacionada:** HU-08 | **Módulo:** Módulo 4 – Auditoría y Reportes | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del sistema**  Requiero poder ver un listado detallado de los intentos de acceso de un empleado específico  Para realizar auditorías de seguridad y verificar el cumplimiento de protocolos de acceso.  **Requerimiento:** RF-10: El sistema debe mostrar el historial de accesos filtrado por empleado. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador selecciona un empleado desde la tabla de personal. | Hace clic en "Ver historial". | El sistema despliega una tabla con fecha, hora, tipo de resultado y estado del acceso, ordenados del más reciente al más antiguo. |
| **Condición 02** | El empleado no tiene registros de acceso. | Se consulta su historial. | El sistema muestra el mensaje "No se encontraron registros de acceso para este empleado". |
| **Condición 03** | El historial es extenso. | Se visualiza. | Los registros se muestran paginados con 20 registros por página. |
| **Condición 04** | El administrador aplica filtro por rango de fechas. | Selecciona fechas de inicio y fin. | La tabla muestra solo los eventos dentro del período seleccionado. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Desarrollar consulta SQL parametrizada por ID de empleado con paginación. | | |
| **2** | Crear interfaz de visualización de registros en el panel de detalles del empleado. | | |
| **3** | Configurar el mapeo de timestamps a formato local legible (dd/MM/yyyy HH:mm:ss). | | |
| **4** | Integrar librería de selector de rango de fechas (DateRangePicker) en React. | | |
| **5** | Implementar endpoint GET /api/logs/employee/{id} con parámetros startDate, endDate, page, size. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-11** | | | |
| **Nombre:** Filtro de auditoría por rango de fechas | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-10, HU-12 | **Módulo:** Módulo 4 – Auditoría y Reportes | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del sistema**  Requiero un filtro de calendario para definir una fecha de inicio y una de fin en el historial general  Para obtener los accesos de períodos o turnos específicos para análisis de seguridad.  **Requerimiento:** RF-11: El sistema debe permitir filtrar logs de acceso por rango de fechas. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador define un rango de fechas con datos existentes. | Aplica el filtro. | La tabla muestra solo los eventos dentro del período, con conteo total al inicio. |
| **Condición 02** | La fecha fin es anterior a la de inicio. | Se intenta aplicar el filtro. | El sistema muestra "La fecha final no puede ser anterior a la fecha inicial" y no aplica el filtro. |
| **Condición 03** | El inicio y fin son el mismo día. | Se filtra. | Se muestran todos los logs de esa jornada completa (00:00:00 a 23:59:59). |
| **Condición 04** | No hay registros en el rango seleccionado. | Se aplica el filtro. | El sistema muestra "Sin registros en el período seleccionado" y un botón para limpiar el filtro. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Instalar y configurar librería de calendario (react-date-range) en React. | | |
| **2** | Programar validación de fechas en el frontend antes de enviar la petición. | | |
| **3** | Ajustar el servicio de logs para recibir parámetros startDate y endDate. | | |
| **4** | Crear índices en la base de datos para la columna access\_time. | | |
| **5** | Implementar botón de "Limpiar filtros" para resetear la búsqueda. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-12** | | | |
| **Nombre:** Exportación de historial a PDF | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-10, HU-11 | **Módulo:** Módulo 4 – Auditoría y Reportes | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del sistema**  Requiero un botón para descargar el historial de accesos de un empleado en formato PDF  Para presentar informes impresos detallados para evaluaciones y auditorías internas.  **Requerimiento:** RF-12: El sistema debe generar reportes PDF descargables del historial de accesos. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | Hay datos en la tabla del historial (con o sin filtros aplicados). | Se pulsa "Exportar PDF". | Se inicia la descarga automática del archivo PDF con los datos visibles en pantalla. |
| **Condición 02** | El archivo PDF es generado. | Se abre. | Incluye encabezado institucional ROOM\_911, datos del empleado, filtros aplicados, datos alineados y nombre del administrador que lo generó. |
| **Condición 03** | El historial tiene más de 100 registros. | Se genera el PDF. | El documento pagina correctamente los registros manteniendo el encabezado en cada página. |
| **Condición 04** | La tabla está vacía (sin registros). | Se intenta exportar. | El botón de exportar está deshabilitado y muestra el tooltip "No hay datos para exportar". |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Configurar librería iText o JasperReports en Spring Boot para generación de PDF. | | |
| **2** | Crear diseño del reporte con encabezado institucional, datos del empleado y tabla de registros. | | |
| **3** | Implementar stream de descarga en el controlador con Content-Disposition. | | |
| **4** | Asignar nombre dinámico al archivo: historial\_{nombre\_empleado}\_{fecha}.pdf. | | |
| **5** | Deshabilitar botón de exportar cuando no hay registros en pantalla. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**MÓDULO 5 – Monitoreo en Tiempo Real**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-13** | | | |
| **Nombre:** Monitor de presencia en tiempo real | | | |
| **Complejidad:** Alta | **HU Relacionada:** HU-08, HU-09 | **Módulo:** Módulo 5 – Monitoreo en Tiempo Real | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del sistema**  Requiero un panel visual de tarjetas dinámicas para cada empleado que esté dentro del ROOM\_911  Para saber instantáneamente quién está dentro del área y detectar situaciones de riesgo.  **Requerimiento:** RF-13: El sistema debe mostrar en tiempo real quién está dentro del ROOM\_911. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | Un empleado realiza un acceso exitoso. | El campo is\_inside cambia a true. | La tarjeta del empleado aparece en el panel en color verde con su nombre, ID y tiempo de permanencia. |
| **Condición 02** | Un empleado registra su salida del ROOM\_911. | El campo is\_inside cambia a false. | La tarjeta del empleado desaparece del panel y el espacio queda libre. |
| **Condición 03** | Un empleado supera el tiempo máximo de permanencia configurado. | Se cumple el tiempo. | La tarjeta cambia de verde a amarillo y emite una notificación visual y sonora al administrador. |
| **Condición 04** | El tiempo de estancia supera en un 50% el límite máximo. | Continúa sin salir. | La tarjeta cambia a rojo con animación de parpadeo indicando situación crítica. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Maquetar el grid de tarjetas dinámicas en el Dashboard de React. | | |
| **2** | Implementar servidor WebSocket en Spring Boot (STOMP sobre SockJS). | | |
| **3** | Crear el listener en el frontend para eventos de cambio de estado. | | |
| **4** | Implementar transiciones de color (verde → amarillo → rojo) mediante CSS dinámico. | | |
| **5** | Programar carga inicial de estados de empleados al abrir el monitor. | | |
| **6** | Agregar contador de tiempo de permanencia en cada tarjeta, actualizado cada segundo. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-14** | | | |
| **Nombre:** Control de aforo y alertas de estancia prolongada | | | |
| **Complejidad:** Alta | **HU Relacionada:** HU-13 | **Módulo:** Módulo 5 – Monitoreo en Tiempo Real | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador del sistema**  Requiero que el sistema valide el aforo máximo y el tiempo máximo de permanencia configurados  Para evitar riesgos de salud, aglomeraciones y cumplir con las normas de seguridad del área.  **Requerimiento:** RF-14: El sistema debe controlar el aforo y emitir alertas de estancia prolongada. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El número de empleados dentro del ROOM\_911 es igual al aforo máximo configurado. | Alguien más intenta entrar. | El sistema deniega el acceso, muestra "Aforo máximo alcanzado" y registra el intento como fallido por aforo. |
| **Condición 02** | Un empleado lleva más tiempo del máximo configurado dentro del área. | Se cumple el tiempo. | El sistema notifica visualmente y registra una observación automática en el log de accesos. |
| **Condición 03** | El Super Admin cambia los límites de aforo o tiempo máximo en la configuración. | Guarda los cambios. | Las validaciones se actualizan de inmediato sin necesidad de reiniciar el sistema. |
| **Condición 04** | El aforo actual supera el 80% del límite. | El monitor está activo. | El indicador de aforo en el dashboard cambia a color amarillo de advertencia. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Implementar lógica de conteo de is\_inside = true en el validador de acceso. | | |
| **2** | Desarrollar un scheduler de fondo para monitorear cronómetros de permanencia. | | |
| **3** | Crear la vista de configuración vinculada a la tabla room\_settings. | | |
| **4** | Implementar clases CSS para alerta visual de parpadeo rojo. | | |
| **5** | Vincular las alertas de tiempo con el envío de una observación automática al log. | | |
| **6** | Agregar indicador de ocupación (ej. 3/10 empleados) en el header del monitor. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**MÓDULO 6 – Super Administrador**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-15** | | | |
| **Nombre:** Dashboard del Super Administrador | | | |
| **Complejidad:** Alta | **HU Relacionada:** HU-01, HU-02 | **Módulo:** Módulo 6 – Super Administrador | |
| **DESCRIPCIÓN** | | | |
| Yo como **Super Administrador**  Requiero un dashboard con visión global del sistema: todos los departamentos, admins y métricas generales  Para supervisar el estado del sistema completo y tomar decisiones de gestión informadas.  **Requerimiento:** RF-15: El sistema debe proveer al Super Admin una vista global con métricas consolidadas. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El Super Admin inicia sesión con su cuenta. | El sistema procesa sus credenciales. | El sistema lo redirige a su dashboard exclusivo con métricas globales: total de empleados, accesos del día, admins activos y aforo actual. |
| **Condición 02** | El Super Admin navega por el panel de administradores. | Visualiza la lista. | Ve todos los administradores del sistema con su departamento, estado (activo/inactivo) y último acceso. |
| **Condición 03** | El Super Admin selecciona un departamento. | Hace clic en él. | Puede ver los empleados, logs y métricas específicas de ese departamento como si fuera el admin de ese departamento. |
| **Condición 04** | El Super Admin consulta el log de auditoría administrativa. | Accede al módulo. | Ve un historial completo de todas las acciones CRUD realizadas por todos los administradores con usuario, fecha y descripción del cambio. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear layout exclusivo para el rol super\_admin en React con navegación extendida. | | |
| **2** | Implementar endpoint GET /api/superadmin/dashboard con métricas consolidadas. | | |
| **3** | Desarrollar panel de gestión de administradores con tabla, búsqueda y acciones. | | |
| **4** | Implementar vista impersonation para navegar como un admin de departamento. | | |
| **5** | Crear sección de log de auditoría administrativa con filtros por usuario y fecha. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-16** | | | |
| **Nombre:** Gestión de departamentos | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-15 | **Módulo:** Módulo 6 – Super Administrador | |
| **DESCRIPCIÓN** | | | |
| Yo como **Super Administrador**  Requiero poder crear, editar y desactivar departamentos del sistema  Para mantener actualizada la estructura organizacional que rige el acceso al ROOM\_911.  **Requerimiento:** RF-16: El sistema debe permitir al Super Admin gestionar los departamentos. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El Super Admin completa el formulario de nuevo departamento con nombre y descripción. | Presiona "Crear departamento". | El sistema crea el departamento y está disponible inmediatamente para asignar empleados y admins. |
| **Condición 02** | El Super Admin edita el nombre de un departamento. | Guarda los cambios. | El cambio se refleja en todos los empleados y admins asociados a ese departamento. |
| **Condición 03** | El Super Admin intenta desactivar un departamento con empleados activos. | Confirma la acción. | El sistema muestra advertencia con el número de empleados afectados y requiere confirmación explícita. |
| **Condición 04** | El Super Admin crea un departamento con un nombre ya existente. | Intenta guardar. | El sistema muestra "Ya existe un departamento con ese nombre". |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear módulo CRUD de departamentos en React con tabla, formulario y modal de confirmación. | | |
| **2** | Implementar endpoints GET/POST/PUT/DELETE /api/departments en Spring Boot. | | |
| **3** | Agregar validación de unicidad de nombre de departamento. | | |
| **4** | Implementar lógica de desactivación con verificación de dependencias. | | |
| **5** | Registrar cambios de departamento en el log de auditoría administrativa. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-17** | | | |
| **Nombre:** Configuración global del ROOM\_911 | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-14, HU-15 | **Módulo:** Módulo 6 – Super Administrador | |
| **DESCRIPCIÓN** | | | |
| Yo como **Super Administrador**  Requiero poder configurar el aforo máximo y el tiempo máximo de permanencia del ROOM\_911  Para adaptar los parámetros de seguridad del área a los protocolos vigentes del laboratorio.  **Requerimiento:** RF-17: El sistema debe permitir al Super Admin configurar los parámetros del ROOM\_911. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El Super Admin actualiza el aforo máximo permitido. | Guarda el cambio. | El nuevo límite se aplica inmediatamente en el validador de acceso y el monitor en tiempo real. |
| **Condición 02** | El Super Admin actualiza el tiempo máximo de permanencia. | Guarda el cambio. | El scheduler de monitoreo adopta el nuevo límite para las alertas de estancia prolongada. |
| **Condición 03** | El Super Admin ingresa un valor inválido (cero o negativo). | Intenta guardar. | El sistema muestra validación "El valor debe ser mayor a cero". |
| **Condición 04** | Se modifica cualquier parámetro de room\_settings. | Se guarda el cambio. | Se registra en el log de auditoría: quién cambió qué valor, del valor anterior al nuevo. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear formulario de configuración en React con campos numéricos validados. | | |
| **2** | Implementar endpoint PUT /api/room/settings en Spring Boot. | | |
| **3** | Diseñar tabla room\_settings en PostgreSQL con historial de cambios. | | |
| **4** | Invalidar y recargar configuración en caché al actualizar parámetros. | | |
| **5** | Registrar cambio de configuración en admin\_action\_log. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-18** | | | |
| **Nombre:** Log de auditoría administrativa | | | |
| **Complejidad:** Alta | **HU Relacionada:** HU-15, TODAS | **Módulo:** Módulo 6 – Super Administrador | |
| **DESCRIPCIÓN** | | | |
| Yo como **Super Administrador**  Requiero registrar y consultar cada cambio CRUD realizado por los administradores del sistema  Para saber quién editó, borró o creó datos en el sistema y mantener trazabilidad completa.  **Requerimiento:** RF-18: El sistema debe registrar todas las acciones administrativas con usuario, fecha y detalle. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | Un administrador realiza cualquier acción CRUD (crear, editar o eliminar). | La acción se guarda en base de datos. | Se crea automáticamente un registro en admin\_action\_log con usuario, acción, entidad afectada, ID del registro y timestamp. |
| **Condición 02** | El Super Admin consulta el log de auditoría. | Accede al módulo. | Ve tabla paginada con: usuario, tipo de acción, entidad, descripción del cambio y fecha/hora. |
| **Condición 03** | El Super Admin filtra el log por administrador y rango de fechas. | Aplica los filtros. | El sistema muestra solo las acciones que coinciden con los criterios seleccionados. |
| **Condición 04** | Un administrador intenta acceder al log de auditoría. | Navega a la ruta. | El sistema deniega el acceso y muestra "Acceso restringido: Solo Super Administrador". |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear tabla admin\_action\_log en PostgreSQL con campos: id, admin\_id, action\_type, entity, entity\_id, description, created\_at. | | |
| **2** | Implementar un AOP (Aspect-Oriented Programming) interceptor en Spring Boot para capturar acciones CRUD automáticamente. | | |
| **3** | Desarrollar endpoint GET /api/superadmin/audit-log con filtros y paginación. | | |
| **4** | Crear interfaz de visualización del log en React con filtros de usuario y fecha. | | |
| **5** | Asegurar que el log sea de solo lectura (sin posibilidad de edición o eliminación). | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**MÓDULO 7 – Configuración Personal**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-19** | | | |
| **Nombre:** Configuración de perfil propio (Admin y Super Admin) | | | |
| **Complejidad:** Baja | **HU Relacionada:** HU-01 | **Módulo:** Módulo 7 – Configuración Personal | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador o Super Administrador**  Requiero poder actualizar mis datos personales (nombre, apellido, email) desde la configuración de mi cuenta  Para mantener mi información de perfil actualizada y correcta en el sistema.  **Requerimiento:** RF-19: El sistema debe permitir a cualquier usuario admin actualizar su información de perfil. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El usuario accede a la sección "Mi perfil" y actualiza su nombre o apellido. | Guarda los cambios. | El sistema actualiza la información y la refleja inmediatamente en el header de la aplicación. |
| **Condición 02** | El usuario intenta actualizar su email a uno ya registrado por otro usuario. | Guarda los cambios. | El sistema muestra "El email ya está en uso por otro usuario". |
| **Condición 03** | El usuario actualiza su foto de perfil. | Sube una imagen válida (JPG/PNG, máx 2MB). | El sistema actualiza el avatar en el header y en el perfil sin necesidad de recargar la página. |
| **Condición 04** | El usuario sube una imagen que excede el tamaño máximo. | Intenta guardar. | El sistema muestra "La imagen no debe superar 2MB" y no realiza el cambio. |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear sección "Mi perfil" en React accesible desde el menú de usuario. | | |
| **2** | Implementar endpoint PUT /api/users/me con validación de unicidad de email. | | |
| **3** | Agregar funcionalidad de upload de foto de perfil con compresión en frontend. | | |
| **4** | Actualizar el estado global (Context/Redux) para reflejar cambios de nombre en el header. | | |
| **5** | Implementar endpoint PATCH /api/users/me/avatar para actualizar la foto. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-20** | | | |
| **Nombre:** Cambio de contraseña propia | | | |
| **Complejidad:** Baja | **HU Relacionada:** HU-01, HU-19 | **Módulo:** Módulo 7 – Configuración Personal | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador o Super Administrador**  Requiero poder cambiar mi contraseña desde la configuración de mi cuenta ingresando la contraseña actual  Para mantener la seguridad de mi cuenta y actualizar credenciales periódicamente.  **Requerimiento:** RF-20: El sistema debe permitir el cambio de contraseña verificando la contraseña actual. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El usuario ingresa su contraseña actual correcta y una nueva contraseña válida. | Presiona "Cambiar contraseña". | El sistema actualiza la contraseña con encriptación bcrypt y cierra todas las demás sesiones activas. |
| **Condición 02** | El usuario ingresa una contraseña actual incorrecta. | Intenta cambiarla. | El sistema muestra "La contraseña actual es incorrecta" sin revelar información adicional. |
| **Condición 03** | La nueva contraseña no cumple los requisitos de seguridad. | Intenta guardarla. | El sistema muestra los criterios incumplidos: mínimo 8 caracteres, mayúscula, número y carácter especial. |
| **Condición 04** | El usuario cambia la contraseña exitosamente. | Se completa el proceso. | El sistema redirige al login mostrando el mensaje "Contraseña actualizada. Por favor inicie sesión nuevamente". |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Crear formulario de cambio de contraseña con campos: contraseña actual, nueva, confirmación. | | |
| **2** | Implementar indicador visual de fortaleza de contraseña en tiempo real. | | |
| **3** | Crear endpoint POST /api/users/me/change-password en Spring Boot. | | |
| **4** | Implementar verificación de contraseña actual antes de actualizar. | | |
| **5** | Invalidar todos los tokens JWT activos del usuario al cambiar contraseña. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**MÓDULO 8 – Dashboard de Analítica**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-21** | | | |
| **Nombre:** Dashboard estadístico de accesos por departamento | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-10, HU-11 | **Módulo:** Módulo 8 – Dashboard de Analítica | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador o Super Administrador**  Requiero gráficas de barras y circular sobre el uso del ROOM\_911 por departamento y por periodo  Para identificar qué departamentos tienen mayor rotación y detectar patrones de uso del área.  **Requerimiento:** RF-21: El sistema debe proveer un dashboard con estadísticas visuales de accesos. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador abre el dashboard. | La página carga. | Se muestran los accesos agrupados por nombre de departamento en una gráfica de barras y una circular. |
| **Condición 02** | El usuario pulsa en una sección del gráfico circular. | Hace clic. | Se muestra el número exacto de entradas, porcentaje y lista de empleados de ese departamento. |
| **Condición 03** | El usuario aplica un filtro de período (hoy, semana, mes, personalizado). | Selecciona el rango. | Todas las gráficas se actualizan con los datos del período seleccionado. |
| **Condición 04** | Un filtro no tiene resultados. | Se carga el gráfico. | Se muestra el mensaje "Sin actividad registrada en el período seleccionado". |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Integrar librería Recharts o Chart.js en React para gráficas interactivas. | | |
| **2** | Crear consulta SQL con GROUP BY department\_id y filtros de fecha. | | |
| **3** | Desarrollar endpoint GET /api/statistics/access-by-department con parámetros de período. | | |
| **4** | Implementar filtros de tiempo rápidos: hoy, esta semana, este mes, personalizado. | | |
| **5** | Asegurar que las gráficas sean responsivas para dispositivos móviles. | | |
| **6** | Agregar tarjetas de métricas rápidas: total accesos hoy, accesos exitosos/fallidos, empleados únicos. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**MÓDULO 9 – Seguridad y Recuperación**

|  |  |  |  |
| --- | --- | --- | --- |
| **HISTORIA DE USUARIO HU-22** | | | |
| **Nombre:** Recuperación de contraseña por correo | | | |
| **Complejidad:** Media | **HU Relacionada:** HU-01 | **Módulo:** Módulo 9 – Seguridad y Recuperación | |
| **DESCRIPCIÓN** | | | |
| Yo como **Administrador o Super Administrador**  Requiero restablecer mi contraseña mediante un enlace enviado a mi correo electrónico  Para recuperar el acceso al sistema de forma autónoma sin depender de otro usuario.  **Requerimiento:** RF-22: El sistema debe permitir la recuperación de contraseña mediante correo electrónico. | | | |
| **CRITERIOS DE ACEPTACIÓN** | | | |
| **Condición** | **Dado** | **Cuando** | **Entonces** |
| **Condición 01** | El administrador ingresa un correo válido registrado en el sistema. | Solicita el restablecimiento. | El sistema envía un correo con un enlace único y token válido por 30 minutos. |
| **Condición 02** | El token enviado supera los 30 minutos sin utilizarse. | El administrador hace clic en el enlace. | El sistema muestra "El enlace ha expirado. Solicite uno nuevo" y redirige al formulario de recuperación. |
| **Condición 03** | El administrador crea una nueva contraseña válida. | Guarda el cambio. | La contraseña se encripta con bcrypt, el token se invalida y el sistema redirige al login con mensaje de éxito. |
| **Condición 04** | El administrador ingresa un correo no registrado. | Solicita el restablecimiento. | El sistema muestra "Si el correo está registrado, recibirás las instrucciones" (sin confirmar existencia por seguridad). |
| **TAREAS TÉCNICAS** | | | |
| **No** | **Descripción** | | |
| **1** | Configurar servicio SMTP de correos (JavaMailSender en Spring Boot). | | |
| **2** | Crear lógica de generación de tokens temporales con UUID y expiración de 30 minutos. | | |
| **3** | Diseñar formulario de "Recuperar contraseña" y "Nueva contraseña" en React. | | |
| **4** | Implementar endpoint POST /api/auth/forgot-password y POST /api/auth/reset-password. | | |
| **5** | Programar eliminación automática de tokens usados o expirados mediante scheduler. | | |
| **CONTROL DE VERSIONES**  Versión: 1.0 | Fecha: 2025 | Autor: Equipo de Desarrollo | Aprobador: Pendiente | | | |

**CATÁLOGO DE REQUERIMIENTOS FUNCIONALES**

|  |  |  |
| --- | --- | --- |
| **Código** | **Nombre del Requerimiento** | **Descripción** |
| **RF-01** | Autenticación de usuarios | El sistema debe permitir el ingreso solo a usuarios con rol admin\_room\_911 o super\_admin mediante usuario y contraseña con JWT. |
| **RF-02** | Gestión de administradores | El sistema debe permitir crear, editar y desactivar perfiles de usuarios administrativos con asignación de departamento. |
| **RF-03** | Edición de administradores | El sistema debe permitir al Super Admin editar y desactivar cuentas de administradores, invalidando sesiones activas. |
| **RF-04** | Registro individual de empleados | El sistema debe permitir el registro manual de empleados con datos básicos y asignación de departamento. |
| **RF-05** | Carga masiva de empleados | El sistema debe permitir la importación masiva de empleados a través de archivos en formato CSV con reporte de resultados. |
| **RF-06** | Edición de empleados y permisos | El sistema debe permitir editar la información de un empleado y habilitar o deshabilitar su acceso al ROOM\_911. |
| **RF-07** | Búsqueda y filtrado de empleados | El sistema debe permitir buscar empleados por ID, nombre o apellido y filtrar por departamento con paginación. |
| **RF-08** | Simulador de escáner de carnet | El sistema debe contar con un formulario para simular la lectura del carnet corporativo validando permiso y registrando el intento. |
| **RF-09** | Control de aforo del ROOM\_911 | El sistema debe gestionar entradas y salidas para calcular el aforo actual y denegar accesos cuando el límite sea alcanzado. |
| **RF-10** | Historial de accesos por empleado | El sistema debe mostrar el historial detallado de intentos de acceso filtrado por empleado y rango de fechas. |
| **RF-11** | Filtro de auditoría por rango de fechas | El sistema debe permitir filtrar los logs de acceso mediante selector de rango de fechas con validaciones. |
| **RF-12** | Exportación de historial a PDF | El sistema debe generar documentos PDF descargables con el historial de accesos con encabezado institucional. |
| **RF-13** | Monitor de presencia en tiempo real | El sistema debe mostrar mediante WebSockets quién está dentro del ROOM\_911 con indicadores visuales de estado. |
| **RF-14** | Control de aforo y alertas de estancia | El sistema debe controlar el aforo máximo y emitir alertas visuales cuando un empleado supere el tiempo máximo de permanencia. |
| **RF-15** | Dashboard del Super Administrador | El sistema debe proveer al Super Admin una vista global con métricas consolidadas de todos los departamentos y administradores. |
| **RF-16** | Gestión de departamentos | El sistema debe permitir al Super Admin crear, editar y desactivar departamentos con validación de dependencias. |
| **RF-17** | Configuración global del ROOM\_911 | El sistema debe permitir al Super Admin configurar el aforo máximo y el tiempo máximo de permanencia con efecto inmediato. |
| **RF-18** | Log de auditoría administrativa | El sistema debe registrar automáticamente todas las acciones CRUD de los administradores con trazabilidad completa. |
| **RF-19** | Configuración de perfil propio | El sistema debe permitir a cualquier usuario admin actualizar su información personal y foto de perfil. |
| **RF-20** | Cambio de contraseña propia | El sistema debe permitir el cambio de contraseña verificando la contraseña actual y cerrando sesiones activas. |
| **RF-21** | Dashboard estadístico de analítica | El sistema debe proveer gráficas interactivas de accesos por departamento con filtros de período de tiempo. |
| **RF-22** | Recuperación de contraseña por correo | El sistema debe permitir la recuperación de contraseña mediante enlace por correo electrónico con expiración de 30 minutos. |

**CATÁLOGO DE REQUERIMIENTOS NO FUNCIONALES**

|  |  |  |
| --- | --- | --- |
| **Código** | **Nombre del Requerimiento** | **Descripción** |
| **RNF-01** | Arquitectura | El sistema debe desarrollarse con Spring Boot (backend REST) y React.js (frontend SPA), siguiendo el patrón de capas: Controller → Service → Repository. |
| **RNF-02** | Persistencia | Los datos deben gestionarse en PostgreSQL. Todos los nombres de campos en la base de datos deben estar en inglés. |
| **RNF-03** | Seguridad | Las contraseñas deben almacenarse encriptadas con BCrypt. Las rutas deben protegerse con JWT y control de roles (admin\_room\_911, super\_admin). |
| **RNF-04** | Comunicación en tiempo real | El módulo de monitoreo debe usar WebSockets (STOMP sobre SockJS) para actualizaciones en tiempo real sin polling. |
| **RNF-05** | Usabilidad | La interfaz debe ser intuitiva, responsiva y accesible. Debe funcionar correctamente en resoluciones desde 375px (móvil) hasta 1920px (escritorio). |
| **RNF-06** | Rendimiento | Las consultas a la base de datos deben responder en menos de 500ms en condiciones normales. Las tablas con más de 100 registros deben implementar paginación. |
| **RNF-07** | Escalabilidad | El backend debe estar diseñado para poder escalar horizontalmente. Las configuraciones sensibles deben manejarse mediante variables de entorno. |
| **RNF-08** | Mantenibilidad | El código debe seguir principios SOLID, con cobertura mínima de pruebas unitarias del 70% en la capa de servicios. |
| **RNF-09** | Disponibilidad | El sistema debe tener una disponibilidad del 99.5% durante el horario laboral. Las operaciones críticas deben manejar reintentos automáticos. |
| **RNF-10** | Trazabilidad | Todas las acciones administrativas deben quedar registradas en el log de auditoría. Los logs del servidor deben usar SLF4J con formato estructurado. |
| **RNF-11** | Compatibilidad de navegadores | La interfaz debe ser compatible con las últimas versiones de Chrome, Firefox, Edge y Safari. |
| **RNF-12** | Internacionalización | La interfaz debe estar en español colombiano. Los timestamps deben mostrarse en la zona horaria América/Bogotá (UTC-5). |
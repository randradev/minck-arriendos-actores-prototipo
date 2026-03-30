# Diseño de Pruebas Manuales: Directorio de Actores Inmobiliarios

Este documento detalla los escenarios de prueba para validar la funcionalidad, integridad de datos y experiencia de usuario del prototipo.

---

## 1. Módulo: Listado de Actores (Agrupación y Filtros)

### Escenario 1.1: Agrupación por Cabeceras (Nueva Funcionalidad)
*   **Acción:** Hacer clic en el título de la columna **"Tipo de Entidad"**.
*   **Resultado Esperado:** La tabla debe ordenarse agrupando primero todas las personas "Naturales" y luego las "Jurídicas" (o viceversa). El icono de flecha debe activarse.
*   **Acción:** Hacer clic en el título de la columna **"Estado"**.
*   **Resultado Esperado:** Los actores deben agruparse por su estado (ej: todos los "Bloqueados" juntos).
*   **Acción:** Intentar hacer clic en **"Nombre del Actor"**.
*   **Resultado Esperado:** No debe haber interacción ni cambio de cursor, ya que esta columna está restringida.

### Escenario 1.2: Filtros por Pestañas (Tabs)
*   **Acción:** Cambiar entre las pestañas "Todos", "Activos", "Pendientes", "Bloqueados" y "Archivados".
*   **Resultado Esperado:** 
    *   La lista debe filtrarse instantáneamente.
    *   El contador numérico en la pestaña debe coincidir con la cantidad de registros visibles.
    *   El "Quick Insight" de crecimiento debe permanecer visible.

### Escenario 1.3: Búsqueda Inteligente
*   **Acción:** Escribir un RUT sin puntos ni guion (ej: `123456789`) en la barra de búsqueda superior.
*   **Resultado Esperado:** Debe encontrar al actor "Juan Pablo Rodríguez" (RUT 12.345.678-9) gracias a la normalización de RUT.
*   **Acción:** Buscar por parte de un correo electrónico (ej: `@gmail`).
*   **Resultado Esperado:** Debe mostrar solo los actores con correos de Gmail.

---

## 2. Módulo: Perfil del Actor y Flujo de Documentos

### Escenario 2.1: Gestión de Documentos (Ciclo de Vida)
*   **Acción:** Entrar al perfil de un actor con estado **"Pendiente"** (ej: María Ignacia Valenzuela).
*   **Acción:** Hacer clic en el botón verde de "Aprobar" (Check) en su Cédula de Identidad.
*   **Resultado Esperado:** El badge del documento cambia a "Verificado" y la barra de progreso de validación aumenta.
*   **Acción:** Hacer clic en el botón rojo de "Rechazar" (X).
*   **Resultado Esperado:** Se abre un modal pidiendo el motivo. Al confirmar, el documento debe mostrar el motivo en una caja roja debajo del nombre.

### Escenario 2.2: Versiones de Documentos
*   **Acción:** En un documento existente, hacer clic en el icono de "Subir/Actualizar" (Nube).
*   **Resultado Esperado:** Al subir el "nuevo" archivo, el estado del documento debe volver a "Pendiente" y el historial de versiones (icono de ojo en el nombre) debe mostrar la versión anterior con su fecha antigua. *** PRUEBA NO EXITOSA

### Escenario 2.3: Validación de Activación
*   **Acción:** Intentar aprobar a un actor que no tiene todos sus documentos obligatorios verificados.
*   **Resultado Esperado:** El botón "Aprobar y Activar Actor" debe estar deshabilitado o no realizar la acción, indicando que faltan requisitos.

---

## 3. Módulo: Registro y Edición (Integridad)

### Escenario 3.1: Cambio de Naturaleza
*   **Acción:** En el formulario de registro, cambiar de "Persona Natural" a "Persona Jurídica".
*   **Resultado Esperado:** Los campos de "Profesión" y "Empleador" deben desaparecer, y deben mostrarse los campos de "Tipo de Empresa" y "Representante Legal".

### Escenario 3.2: Consistencia de Representación Legal
*   **Acción:** Ver el perfil de "Inversiones Los Andes SpA".
*   **Resultado Esperado:** En "Datos de Origen", el nombre del representante legal (Juan Pablo Rodríguez) debe ser un link clickable que te lleve directamente al perfil de Juan Pablo.

---

## 4. Módulo: Estados y Restricciones

### Escenario 4.1: Actor Bloqueado
*   **Acción:** Buscar al actor "Roberto Carlos Muñoz Herrera" (Bloqueado).
*   **Resultado Esperado:** 
    *   En la lista, debe tener un badge rojo y un punto indicador.
    *   Al entrar a su perfil, debe aparecer una alerta naranja superior indicando que el sistema ha restringido su operación. *** PRUEBA NO EXITOSA
    *   El "Score de Puntualidad" en sus métricas debe marcar 0/100 o "Crítico".

---

## 5. Pruebas de Interfaz (UX/UI)

### Escenario 5.1: Densidad de Datos (Paginación)
*   **Acción:** Cambiar las filas por página a "1" y luego a "Todo".
*   **Resultado Esperado:** La tabla debe reajustarse correctamente sin romper el layout. En modo "Todo", los controles de navegación de página (flechas) deben deshabilitarse.

### Escenario 5.2: Responsividad
*   **Acción:** Reducir el ancho del navegador a tamaño móvil.
*   **Resultado Esperado:** 
    *   El sidebar debe ocultarse o colapsar.
    *   La tabla debe permitir scroll horizontal.
    *   Los botones de acción en el perfil deben apilarse verticalmente.

# ==========================================================================
# CONTEXTO TÉCNICO MAESTRO: MINCK - MÓDULO DE ACTORES (PROTOTIPO DE ALTO NIVEL)
# ROLE: Senior Frontend Architect & AI Agent Specialist
# ==========================================================================

# 1. IDENTIDAD DEL PROYECTO
- Software: Sistema de Gestión Inmobiliaria Propietario (MINCK).
- Alcance Actual: Prototipo funcional del "Directorio de Actores".
- Propósito: Centralizar Arrendadores, Arrendatarios, Avales y Representantes Legales.
- Infraestructura: SPA en React + Vite. Sin Backend (Estado local basado en MOCK_DATA.ts).

# 2. MODELO DE DATOS Y REGLAS DE NEGOCIO (DOMINIO CHILENO)
El sistema separa entidades por Naturaleza. La IA debe respetar estas restricciones en CADA línea de código:

## A. ENTIDAD NATURAL (Persona Física)
- Atributos obligatorios: 'profession' (Profesión), 'employer' (Empleador).
- Prohibición: No puede tener 'entityType' ni 'legalRepresentativeId'.
- Roles comunes: Arrendatario, Aval, Representante Legal (de una Jurídica).

## B. ENTIDAD JURÍDICA (Empresa/Institución)
- Atributos obligatorios: 'entityType' (SpA, Ltda, S.A., EIRL), 'legalRepresentativeId'.
- Vínculo Crítico: 'legalRepresentativeId' debe apuntar al ID de un Actor de naturaleza 'Natural'.
- Atributo Derivado: 'legalRepresentativeName' debe coincidir con el nombre del Actor Natural vinculado.

## C. FORMATOS Y VALIDACIONES
- RUT (Rol Único Tributario): Estrictamente chileno (XX.XXX.XXX-X). Dígito verificador obligatorio.
- Teléfono: Formato internacional chileno (+56 X XXXX XXXX).
- Emails: Deben ser válidos y corporativos cuando aplique.

# 3. LÓGICA DE ESTADOS Y FLUJO OPERATIVO
El Copiloto debe entender las implicancias de cada estado:
- ACTIVO: El actor puede firmar contratos y está vigente.
- PENDIENTE: Falta documentación (Cédula, Estatutos, etc.). El bot debe sugerir carga de archivos.
- BLOQUEADO: Restricción operativa. Requiere una entrada en 'ActivityLog' que explique el motivo (ej: Morosidad, Incumplimiento).
- ARCHIVADO: Registro histórico no editable en operaciones activas.

# 4. SISTEMA DE DISEÑO (FIDELIDAD TOTAL A MINCK)
El chatbot debe "desaparecer" estéticamente dentro de la interfaz actual:
- Iconografía: Únicamente 'Lucide React' (Stroke: 2px, Size: 20px aprox).
- Tailwind: Usar las clases de la paleta corporativa (Slate, Blue, Neutral).
- Componentes: Reutilizar 'Badge' para estados y 'Card' para contenedores.
- UX: El chat debe ser un panel lateral o burbuja flotante que no obstruya la tabla de actores.

# 5. ARQUITECTURA DEL COPILOTO (INTELIGENCIA EN FRONTEND)
El Chatbot funciona como un agente 'In-Browser' que manipula el estado de React:
- KNOWLEDGE BASE: Acceso de lectura a MOCK_ACTORS, MOCK_CONTRACTS y ActivityLog.
- NAVIGATION: Capacidad de ejecutar 'navigate("/ruta")' mediante react-router-dom.
- ACTION BRIDGE: El bot propone cambios (JSON) que son capturados por un manejador de estado (Context/State).
- FEEDBACK: Tras una acción (ej: cambiar un teléfono), el bot debe confirmar la operación usando terminología inmobiliaria técnica de Chile.

# 6. RESTRICCIONES DE DESARROLLO
- No inventar librerías externas.
- Mantener tipado estricto (TypeScript interfaces).
- Respetar el 'basename' del despliegue en cada redirección del bot.
# ==========================================================================

# 7. IMPLEMENTACIÓN DEL CHATBOT "MINCK-PILOT" (OBJETIVO ACTUAL)
El objetivo primordial es integrar un asistente conversacional que facilite la gestión del Directorio de Actores. Debe ser funcional, ligero y orientado a la acción inmediata.

## A. FUNCIONALIDADES REQUERIDAS (QUÉ DEBE HACER):
- INTERFAZ INTEGRADA: Un componente lateral (Sidebar) o burbuja flotante que respete el Layout actual.
- CONSULTA DE DATOS (READ): Responder preguntas sobre los actores cargados en MOCK_ACTORS (ej: "¿Cuántos arrendatarios están bloqueados?").
- ACCIONES DE ESTADO (WRITE): Ejecutar cambios simples en el estado de React (ej: "Cambia el teléfono de RUT XX.XXX.XXX-X" o "Bloquea a este actor").
- NAVEGACIÓN INTELIGENTE: Cambiar la ruta de la aplicación mediante 'react-router-dom' (ej: "Muéstrame el perfil de Inversiones Norte").
- EXPLICACIÓN DE LÓGICA: Explicar por qué un campo es obligatorio o qué significa un estado de contrato basándose en las reglas de negocio de Minck.

## B. RESTRICCIONES TÉCNICAS (QUÉ NO DEBE HACER):
- NO BACKEND: No intentar realizar llamadas a APIs externas o bases de datos. Todo es manejo de estado local.
- NO ESTILOS EXTRAÑOS: No usar librerías de UI externas (como Material UI o AntD) si no están ya en el proyecto. Solo Tailwind y Lucide.
- NO COMPLICAR EL FLUJO: El bot no debe requerir una configuración de "Login" o "Tokens" para este prototipo.

## C. ESTRATEGIA DE IMPLEMENTACIÓN (EL "CÓMO"):
- HOOK DE ACCIÓN ('useChatAgent'): Crear un Hook que actúe como puente. Este hook recibirá el texto del usuario, lo enviará al modelo (Gemini) y procesará la respuesta JSON para ejecutar funciones como 'updateActor' o 'navigate'.
- SIMULACIÓN DE 'FUNCTION CALLING': El chatbot debe estructurar sus respuestas internas para que el frontend pueda identificar cuándo se ha pedido una acción técnica frente a una simple respuesta de texto.
- FEEDBACK VISUAL: Cada vez que el chatbot realice una acción (ej: navegar), debe mostrar un mensaje de confirmación profesional: "Entendido, te estoy redirigiendo al perfil solicitado."

## D. TONO Y PERSONALIDAD:
- El asistente debe ser profesional, eficiente y conocedor del mercado inmobiliario chileno. No es un chatbot de entretenimiento, es una herramienta de productividad corporativa para Minck.
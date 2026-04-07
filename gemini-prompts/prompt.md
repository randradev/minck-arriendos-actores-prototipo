Prompt para Generación de Datos de Prueba: Directorio de Actores Inmobiliarios
Contexto del Proyecto:
Estoy desarrollando una aplicación de gestión inmobiliaria llamada "Directorio de Actores". La aplicación centraliza la información de personas naturales y jurídicas que participan en contratos (Arrendatarios, Arrendadores, Avales, etc.). Necesito generar un set de datos de prueba (mock data) en TypeScript que sea realista, variado y que respete estrictamente las reglas de integridad definidas en el sistema.
1. Definición de Tipos y Enums:
Los datos deben seguir estas enumeraciones:
EntityNature: 'Natural' | 'Jurídica'
ActorStatus: 'Activo' | 'Pendiente' | 'Bloqueado' | 'Archivado'
ActorRole: 'Arrendatario' | 'Arrendador' | 'Garante' | 'Representante Legal' | 'Aval'
ContractStatus: 'Vigente' | 'Finalizado' | 'En Prórroga'
DocumentStatus: 'Pendiente' | 'Aprobado' | 'Rechazado'
2. Reglas de Entidad (Actor):
Cada Actor debe tener campos específicos según su naturaleza:
Si es 'Natural': Debe incluir obligatoriamente profession (profesión). No debe tener campos de empresa.
Si es 'Jurídica': Debe incluir entityType (ej: SpA, Ltda, S.A.), legalRepresentativeId (ID de otro actor) y legalRepresentativeName.
Roles: Un actor tiene un mainRole (rol principal) y una lista de roles (puede tener varios, ej: ['Arrendador', 'Representante Legal']).
Identificación (RUT): El RUT debe seguir el formato chileno: XX.XXX.XXX-X.
Contacto: Teléfonos con formato +56 X XXXX XXXX y correos electrónicos válidos.
3. Reglas de Relación y Consistencia:
Para que los datos sean útiles en pruebas de UI, debes asegurar lo siguiente:
Representación Legal: Si un Actor A es 'Jurídica' y tiene un legalRepresentativeId que apunta al Actor B, el Actor B debe existir en la lista, ser de naturaleza 'Natural' y tener el rol 'Representante Legal' en su lista de roles.
Contratos: Los contratos deben estar vinculados a un actor. El role en el contrato debe ser uno de los roles que el actor posee.
Documentos: Cada actor debe tener una lista de documentos (ej: "Cédula de Identidad", "Estatutos Sociales", "Certificado de Vigencia"). Si un documento está 'Rechazado', debe incluir un rejectionReason.
Historial (ActivityLog): Genera logs coherentes. Si un actor está 'Bloqueado', debe haber un log reciente que explique la razón (ej: "Bloqueo por comportamiento de pago").
Notificaciones: Crea notificaciones pendientes ('nuevo') para actores con documentos en estado 'Pendiente'.
4. Estructura del Archivo Requerida:
Necesito que generes un archivo mockData.ts que exporte las siguientes constantes:
MOCK_ACTORS: Actor[] (Mínimo 10 actores, mezcla de naturales y jurídicas).
MOCK_CONTRACTS: Record<string, Contract[]> (Indexado por actorId).
MOCK_DOCUMENTS: Record<string, Document[]> (Indexado por actorId).
MOCK_ACTIVITY_LOGS: Record<string, ActivityLog[]> (Indexado por actorId).
MOCK_NOTIFICATIONS: Notification[].
5. Ejemplo de Interfaz de Referencia (TypeScript):
code
TypeScript
interface Actor {
  id: string;
  name: string;
  rut: string;
  nature: EntityNature;
  status: ActorStatus;
  email: string;
  phone: string;
  website?: string;
  mainRole: ActorRole;
  roles: ActorRole[];
  profession?: string; // Solo Natural
  entityType?: string; // Solo Jurídica
  legalRepresentativeId?: string; // Solo Jurídica
  legalRepresentativeName?: string; // Solo Jurídica
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
}
Tarea:
Genera el código TypeScript completo para estas constantes. Asegúrate de que los nombres de las personas y empresas suenen reales (contexto chileno/latinoamericano) y que las fechas de creación sean consistentes (creación < actualización). Los IDs deben ser strings incrementales ('1', '2', '3'...).
Notas para el Asistente Local:
Variedad de Estados: Asegúrate de que al menos 2 actores estén 'Pendientes' y 1 'Bloqueado' para probar los badges de estado.
Casos de Borde: Incluye un actor que sea 'Natural' pero que también sea 'Representante Legal' de una de las empresas creadas.
Documentación: Incluye versiones en los documentos para probar la lógica de historial de archivos.
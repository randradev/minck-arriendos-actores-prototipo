# Documentación Técnica: Módulo de Gestión de Propiedades - Proyecto Minck
Esta documentación define la estructura de datos, reglas de validación y lógica de estados para el módulo de Propiedades. Su objetivo es asegurar la consistencia operativa y legal del sistema ERP.
## 1. Estructura de datos
Los datos se agrupan en seis categorías funcionales para facilitar la gestión y visualización:
### A. Identificación y Ubicación:
- ID Interno: Identificador autoincremental del sistema.
- Nombre de Fantasía: Nombre descriptivo para reconocimiento rápido (ej: "Bodega Logística San Ignacio")
- Rol de Avalúo: Identificación ante el SII (formato ej: 1234-56)
- Dirección completa: Calle y número.
- Unidad/Depto/Oficina: Identificación específica dentro de un edificio.
- Comuna y Región: Ubicación administrativa (ej: Santiago, Peñaflor).
- Coordenadas Geográficas: Latitud y longitud para integración con mapas.
### B. Atributos Físicos y Uso
- Tipo de Propiedad: Categoría del inmueble (Oficina, Departamento, Bodega, Local Comercial, Terreno)
- Superficie Total (m2): Desglose en superficie útil y terraza/patio.
- Distribución: Número de privados/habitaciones, baños y plantas.
- Estacionamientos y Bodegas: Cantidad e identificación específica.
- Año de Construcción: Dato para depreciación y gestión de seguros.
### C. Información Financiera
- Valor Arriendo Referencial: Precio objetivo de mercado en UF o Pesos.
- Avalúo Fiscal: Valoración vigente según el SII.
- Contribuciones: Monto del pago trimestral.
- Gasto Común Promedio: Valor referencial para el arrendatario.
- Cuentas de Servicios: Números de cliente para luz, agua y otros servicios.
### D. Dossier Legal y Multimedia
- Inscripción CBRS: Datos de Título de dominio (Fojas, Número y Año) y PDF de la copia vigente.
- Documentación Técnica: CIP (Certificado de Informaciones Previas), Recepción Final, Escritura de Compraventa y Planos.
- Archivos Multimedia: Galería de fotos, Tour virtual (360 grados) e Inventario fotográfico de entrega.
### E. Relaciones
- ID del Propietario (Actor): Identificador del dueño (vinculado al módulo de Actores).
## 2. Reglas de Validación y Consistencia
### Listas Taxativas (Inputs Controlados)
Para mantener la integridad de los datos, los siguientes campos deben ser selecciones cerradas:
- Tipo: Oficina, Departamento, Bodega, Local Comercial, Casa, Terreno, Estacionamiento.
- Comuna: Santiago, Peñaflor, Providencia, Las Condes, Pudahuel.
- Región: Metropolitana, Valparaíso, etc.
- Unidad de Medida: Pesos ($), UF.
### Campos obligatorios para creación de registro
A continuación se presenta una lista (dividida por categorías para mayor claridad), de los campos que deberían considerarse obligatorios para crear un registro de propiedad:
- Identificación: Nombre de Fantasía, Rol SII
- Ubicación: Dirección, Comuna, Región
- Físico: Tipo de Propiedad, Superficie (m2)
- Legal: Propietario ID (Actor)
- Financiero: Valor Arriendo Ref, Estado
## 3. Lógica de Estados y Activación Crítica
El sistema evalúa constantemente la "Salud del Dato" para determinar si una propiedad puede ser utilizada en el negocio.
### El Checklist de los 6 Puntos Críticos
El sistema permite **crear** una propiedad con los campos obligatorios básicos, pero se mantendrá en estado **Pendiente** y quedará bloqueada para nuevos contratos si falta cualquiera de estos elementos adicionales:
1. Propietario ID: Necesario para identificar al beneficiario del pago.
2. Rol SII: Necesario para individualizar el inmueble legalmente.
3. Dirección y Comuna: Información básica para las cláusulas de ubicación.
4. Valor Arriendo Ref: Piso de negociación para el módulo de contratos.
5. Estado "Disponible": Evita duplicidad de arriendos.
6. Inscripción CBR: Datos de Fojas/Número/Año y carga del PDF de vigencia. Es la prueba legal de facultad para disponer del bien.
### Matriz de Estados (Lifecycle):
- PENDIENTE: Estado inicial. Existe en la BD pero no es apta para contratos por falta de información crítica.
- DISPONIBLE: Información crítica validada (Checklist de 6 puntos completo). Es la única seleccionable para nuevos contratos.
- ARRENDADA: Existe un contrato vigente vinculado. El cambio es automático al firmar el contrato y bloquea la propiedad para otros usos.
- INACTIVA / MANTENCIÓN: Fuera de mercado por razones físicas o legales. Excluida de búsquedas y selectores.
## 4. Nota de Arquitectura y Alcance
- Persistencia: por el momento no se implementará una base de datos (DB).
- Lógica de Datos: Toda la lógica de validación, estados y almacenamiento será gestionada exclusivamente del lado del cliente, mantenienso la misma estructura y consistencia que el módulo de "Actores" ya desarrollado.
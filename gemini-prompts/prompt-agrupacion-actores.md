Actúa como desarrollador senior de React. En el componente de la tabla del 'Directorio de Actores', necesito implementar una lógica de ordenamiento/agrupación simple en las cabeceras de las columnas: 'Tipo de Entidad', 'Rol Principal' y 'Estado'.

Requerimientos:

Lógica de Agrupación: Al hacer clic en el título de cualquiera de estas tres columnas, el estado de la tabla debe ordenarse agrupando los registros que compartan el mismo valor en esa categoría (ej: todos los 'Activos' arriba, todos los 'Inactivos' abajo).

Restricción: Esta funcionalidad debe estar restringida únicamente a esas tres columnas. El resto de las columnas no deben tener interacción.

UI: Añade un pequeño indicador visual (como una flecha de orden o un estilo 'cursor: pointer') en las cabeceras mencionadas para indicar que son clicables.

Implementación: Proporciona las modificaciones necesarias en el componente de la tabla, manteniendo la estructura actual.
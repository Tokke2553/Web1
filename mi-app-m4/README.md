# Foro Abierto · M4 Full Contact Forms

Foro Abierto es una aplicación para enviar y consultar propuestas de charlas, talleres y mesas redondas. El formulario se valida en cliente y las propuestas se leen y guardan mediante una API REST local.

## Cómo arrancar

Necesitas Node.js y npm instalados. Desde esta carpeta, instala las dependencias:

```bash
npm install
```

Inicia la API en una terminal:

```bash
npm run dev:api
```

Inicia la aplicación en otra terminal:

```bash
npm run dev
```

Abre en el navegador la dirección local indicada por Vite. La API escucha en `http://localhost:3001` y JSON Server persiste los registros en `db.json`. Los datos son locales a esta copia del proyecto; para que otra persona vea el listado, debe arrancar también la API.

## Comprobaciones

```bash
npm test
npm run lint
npm run build
```

## Cómo funciona

- React Hook Form registra los campos y gestiona el envío sin mantener cada input en estado React.
- `src/schemas/proposal.js` define las reglas y mensajes con Zod; el mismo esquema valida los datos del formulario y las respuestas de la API.
- `src/api/proposals.js` consulta y crea propuestas mediante HTTP. Las respuestas se validan con `safeParse`; una respuesta corrupta produce un error visible en lugar de datos sin validar.
- TanStack Query gestiona la consulta y la mutation. Al completar un registro se invalida la clave de propuestas y se vuelve a consultar el listado.
- La interfaz comunica carga, error, envío, éxito y lista vacía. El filtro por formato se aplica sobre los datos ya cargados.

El resumen debe tener entre 60 y 600 caracteres y la duración entre 10 y 90 minutos. Estos límites mantienen el formulario acotado y permiten presentar propuestas en formatos distintos.

## Estructura

- `src/App.jsx`: formulario, listado y estados de la interfaz.
- `src/api/proposals.js`: peticiones HTTP y claves de consulta.
- `src/schemas/proposal.js`: esquema de entrada y validación de respuestas.
- `src/main.jsx`: configuración de `QueryClientProvider`.
- `db.json`: datos iniciales y almacenamiento de JSON Server.
- `tests/proposals.test.js`: pruebas de validación y detección de respuestas corruptas.

## Uso de IA

Se utilizó Copilot en VS Code para revisar los trabajos anteriores, planificar la M4 e implementar y comprobar la aplicación. Prompts relevantes de esta conversación:

> «Este es el m4, leelo primero de que trata y dime que se pide el trabajo no hagas nada»

> «el 2 **Propuestas para eventos**, haz la planificacion primero, chequea los otros trabajos para usar el mismo formato de trabajo»

La persona autora eligió el tema, revisó y aprobó el plan, y decidió usar JSON Server local al no tener un endpoint alojado. El código y las pruebas se verificaron con `npm test`, `npm run lint` y `npm run build`.

## Autopsia

1. **Usar JSON Server local en lugar de un endpoint público de pruebas.** Permite probar GET y POST persistentes sin crear una cuenta ni depender de un servicio externo. La alternativa era un endpoint alojado; requiere configurar un recurso y compartir su URL. La limitación es que el listado solo está disponible mientras se ejecuta la API local.
2. **Validar también las respuestas de la API con Zod.** Un registro corrupto se muestra como error y no entra en la interfaz. La alternativa era asumir que el servidor siempre devuelve datos válidos; se descartó para hacer explícito el contrato entre el formulario y la API.

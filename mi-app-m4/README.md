# Foro Abierto · M4

Aplicación para enviar y consultar propuestas de charlas, talleres y mesas redondas.

## Cómo arrancar

Necesitas Node.js y npm. Desde esta carpeta:

```bash
npm install
```

Inicia la API en una terminal:

```bash
npm run dev:api
```

Inicia React en otra:

```bash
npm run dev
```

Vite muestra la dirección de la aplicación. JSON Server escucha en `http://localhost:3001` y guarda los registros en `db.json`; por eso se deben mantener los dos procesos activos.

## Cómo funciona

- `src/App.jsx` reúne el formulario y el listado.
- React Hook Form registra los campos. Zod define las reglas y `zodResolver` muestra sus errores.
- `src/api/proposals.js` obtiene y envía datos por HTTP.
- TanStack Query gestiona la consulta y el registro; al guardar, invalida la consulta para actualizar la lista.
- `src/schemas/proposal.js` valida el formulario y las respuestas de la API. `safeParse` rechaza datos corruptos y muestra el error.

El formulario pide nombre, correo, título, formato y un resumen de 30 a 400 caracteres.

## Comprobaciones

```bash
npm test
npm run lint
npm run build
```

## Uso de IA

Se utilizó Copilot en VS Code para revisar los trabajos anteriores, planificar e implementar la M4 y comprobarla. Prompts relevantes:

> «Este es el m4, leelo primero de que trata y dime que se pide el trabajo no hagas nada»

> «el 2 **Propuestas para eventos**, haz la planificacion primero, chequea los otros trabajos para usar el mismo formato de trabajo»

La persona autora eligió el tema y el formato de trabajo, revisó el plan y decidió usar JSON Server local. La aplicación se verificó con las pruebas, el lint y el build indicados arriba.

## Autopsia

1. **JSON Server local en lugar de un endpoint alojado:** permite probar GET y POST persistentes sin crear una cuenta. La alternativa era un servicio público; requiere configurar y compartir su URL. La limitación es que el servidor local debe estar activo para usar la aplicación.
2. **Validar la respuesta de la API con Zod:** así un dato corrupto produce un error visible. La alternativa era confiar en el servidor y usar sus datos directamente.

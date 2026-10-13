# Cinebusca

Cinebusca es una aplicación pequeña para buscar películas por título. Consulta catálogos públicos de SampleAPIs Movies y muestra los títulos, sus pósteres disponibles y las categorías en las que aparecen.

## Cómo arrancar el proyecto

Necesitas Node.js y npm instalados. Desde esta carpeta, ejecuta:

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que indique Vite.

Para comprobar el proyecto:

```bash
npm test
npm run lint
npm run build
```

## Cómo funciona

La aplicación consulta en paralelo siete catálogos de SampleAPIs Movies: animación, clásicos, comedia, drama, familiar, terror y misterio. Después normaliza y combina las películas repetidas, busca el título sin distinguir mayúsculas y muestra los resultados. Si falta un póster o no carga, la tarjeta conserva un marcador de posición.

No se necesita una clave de API. El catálogo se conserva en memoria mientras la página está abierta, de modo que las búsquedas siguientes no vuelven a descargarlo. Al recargar la página se consulta de nuevo.

Es una búsqueda dentro de esos catálogos, no de todas las películas existentes. La disponibilidad y calidad de los datos dependen de la API pública.

## Estructura

- `src/api/movies.js`: descarga y valida los catálogos.
- `src/utils/movies.js`: normaliza, combina y busca películas, y cuenta categorías.
- `src/components/MovieCard.jsx`: presenta cada resultado y gestiona pósteres ausentes.
- `src/App.jsx`: formulario, estados y coordinación de la búsqueda.
- `tests/movies.test.js`: pruebas de las transformaciones y búsquedas.

## Uso de IA

Usé ChatGPT Luna conectado con VS Code, me ayudo en la parte del codigo siguiendo mis instrucciones con prompt, yo me encargue del diseño, instrucciones, ideas y comprobaciones. Dos prompts reales de esta conversación fueron:

> «Vamos hacer una pagina web sobre buscador de pelicula usando un API, no hagas nada primero lee el documento que te he subido, luego planeamos paso a paso las fases.»

> «Haremos comprobaciones después de cada fase»

Decidí usar React, elegir SampleAPIs Movies y mantener el proyecto pequeño. También revisé el diseño, probé búsquedas con resultados y sin ellos, un error de red y un póster ausente. Ejecuté `npm test`, `npm run lint` y `npm run build`. La implementación de los módulos se hizo con ayuda de IA; mis aportaciones manuales fueron definir las preferencias y decisiones del proyecto, y revisar el resultado.

## Autopsia

1. **Descargar varios catálogos y buscar en el navegador.** Elegí siete categorías para ofrecer más variedad sin una clave. La alternativa era usar una API con búsqueda global, como OMDb, que requiere una clave. La limitación es que los resultados dependen de esos catálogos.
2. **Combinar duplicados por identificador de IMDb y mostrar sus categorías en una sola tarjeta.** La alternativa era repetir una película por cada categoría. Elegí combinarla para que la lista sea más clara; si falta el identificador, se usa el título como clave.

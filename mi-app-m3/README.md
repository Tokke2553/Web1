# Cinebusca · M3 Reactor Core

Cinebusca busca películas por título en los catálogos públicos de SampleAPIs Movies. Combina las películas repetidas, muestra sus categorías y enlaza a IMDb cuando hay un identificador disponible.

## Cómo arrancar

Con las dependencias ya instaladas, ejecuta `npm run dev` desde esta carpeta y abre en el navegador la dirección local que indique Vite.

## Organización y estado

- `src/App.jsx`: mantiene el texto de búsqueda y coordina las vistas.
- `src/components/SearchForm.jsx`: input controlado y acción para limpiar la búsqueda.
- `src/components/ResultsSummary.jsx`: mensajes de carga, error y resultados.
- `src/components/MovieGrid.jsx` y `src/components/MovieCard.jsx`: lista con keys estables y presentación de cada película.
- `src/hooks/useMovieCatalog.js`: carga el catálogo al montar la aplicación y expone datos, estado y error.
- `src/api/movies.js`: consulta en paralelo siete categorías de películas.
- `src/utils/movies.js`: valida/normaliza los datos, combina duplicados y ofrece funciones de búsqueda y resumen.

El estado mínimo de la interfaz es el texto del input y el estado asíncrono del catálogo. Los resultados y el número de categorías se calculan a partir de esos valores, no se guardan duplicados. El `useEffect` del hook se justifica porque la carga depende del montaje; su cleanup evita actualizar el estado si el componente se desmonta antes de terminar la petición.

La búsqueda se filtra al escribir sobre el catálogo ya cargado. La API y sus datos dependen de SampleAPIs; la búsqueda se limita a las siete categorías seleccionadas.

## Uso de IA

Se utilizó codex en VS Code para leer el enunciado y adaptar Cinebusca de la práctica anterior. La nueva separación de componentes, el hook y el flujo de estado se implementaron con su ayuda. Prompts reales de esta conversación:

> «Lee por completo el pdf, no hagas nada aún ni modifiques nada de momento, y dime que has comprendido del trabajo»

> «Cogiendo el mismo trabajo del m2 hazlo en otra carpeta dentro del mismo repositorio»

La aportación manual en esta iteración fue decidir conservar Cinebusca y hacer la M3 en una carpeta nueva; no se presenta la nueva implementación como código escrito a mano.

## Autopsia

1. Cargar el catálogo al iniciar y filtrar al escribir. Así la búsqueda se deriva del catálogo y no se repiten siete peticiones por cada consulta. La alternativa era cargar solo al enviar un formulario, como en la versión anterior; se eligió la carga inicial para mantener una interacción inmediata.
2. Combinar duplicados por identificador de IMDb y mostrar sus categorías en una sola tarjeta. La alternativa era repetir una película por categoría. La combinación mantiene la lista más clara, aunque depende de la calidad de los identificadores recibidos.

const MOVIE_CATALOG_URLS = [
  { category: 'Animación', url: 'https://api.sampleapis.com/movies/animation' },
  { category: 'Clásicos', url: 'https://api.sampleapis.com/movies/classic' },
  { category: 'Comedia', url: 'https://api.sampleapis.com/movies/comedy' },
  { category: 'Drama', url: 'https://api.sampleapis.com/movies/drama' },
  { category: 'Familiar', url: 'https://api.sampleapis.com/movies/family' },
  { category: 'Terror', url: 'https://api.sampleapis.com/movies/horror' },
  { category: 'Misterio', url: 'https://api.sampleapis.com/movies/mystery' },
]

let catalogPromise

async function fetchCategory({ category, url }) {
  let response

  try {
    response = await fetch(url)
  } catch (error) {
    throw new Error(`No se pudo conectar con la categoría ${category}.`, { cause: error })
  }

  if (!response.ok) {
    throw new Error(`No se pudo cargar la categoría ${category} (${response.status}).`)
  }

  let movies

  try {
    movies = await response.json()
  } catch (error) {
    throw new Error(`La respuesta de la categoría ${category} no se pudo leer.`, { cause: error })
  }

  if (!Array.isArray(movies)) {
    throw new Error(`La respuesta de la categoría ${category} no tiene el formato esperado.`)
  }

  return { category, movies }
}

export function getMovieCatalog() {
  if (!catalogPromise) {
    catalogPromise = Promise.all(MOVIE_CATALOG_URLS.map(fetchCategory)).catch((error) => {
      catalogPromise = undefined
      throw error
    })
  }

  return catalogPromise
}

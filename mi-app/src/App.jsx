import { useState } from 'react'
import { getMovieCatalog } from './api/movies.js'
import MovieCard from './components/MovieCard.jsx'
import { normalizeMovieCatalog, searchMovies, summarizeCategories } from './utils/movies.js'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('Escribe el título de una película para empezar la búsqueda.')

  async function handleSearch(event) {
    event.preventDefault()
    const searchTerm = query.trim()

    if (!searchTerm || status === 'loading') {
      return
    }

    setStatus('loading')
    setMovies([])
    setMessage('Cargando películas…')

    try {
      const categories = await getMovieCatalog()
      const catalog = normalizeMovieCatalog(categories)
      const searchResults = searchMovies(catalog, searchTerm)

      setMovies(searchResults)
      setStatus('success')

      if (searchResults.length === 0) {
        setMessage(`No encontramos películas con “${searchTerm}”. Prueba con otro título.`)
        return
      }

      const categoryCount = summarizeCategories(searchResults)
      setMessage(
        `${searchResults.length} ${searchResults.length === 1 ? 'película' : 'películas'} encontradas en ${categoryCount} ${categoryCount === 1 ? 'categoría' : 'categorías'}.`,
      )
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? `No se pudo cargar el catálogo. ${error.message} Inténtalo de nuevo.`
          : 'No se pudo cargar el catálogo. Comprueba tu conexión e inténtalo de nuevo.',
      )
    }
  }

  return (
    <>
      <header className="site-header">
        <a className="site-name" href="#inicio" aria-label="Cinebusca, inicio">
          Cinebusca
        </a>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow">Explora el mundo del cine</p>
          <h1 id="page-title">Encuentra tu próxima película</h1>
          <p className="intro">
            Busca películas por título y descubre algo nuevo para ver.
          </p>

          <form className="search-form" role="search" onSubmit={handleSearch}>
            <label htmlFor="movie-query">Título de la película</label>
            <div className="search-controls">
              <input
                id="movie-query"
                name="query"
                type="search"
                placeholder="Ej.: El viaje de Chihiro"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-describedby="search-status"
              />
              <button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Buscando…' : 'Buscar'}
              </button>
            </div>
          </form>
        </section>

        <section
          className="results"
          aria-labelledby="results-title"
          aria-busy={status === 'loading'}
        >
          <h2 id="results-title">Resultados</h2>
          <p
            className="search-status"
            id="search-status"
            role="status"
            aria-live="polite"
            data-state={status}
          >
            {message}
          </p>
          {movies.length > 0 && (
            <div className="movie-results" aria-label="Películas encontradas">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>Cinebusca · Descubre tu próxima película</p>
      </footer>
    </>
  )
}

export default App

import { useState } from 'react'
import MovieGrid from './components/MovieGrid.jsx'
import ResultsSummary from './components/ResultsSummary.jsx'
import SearchForm from './components/SearchForm.jsx'
import { useMovieCatalog } from './hooks/useMovieCatalog.js'
import { searchMovies, summarizeCategories } from './utils/movies.js'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const { movies: catalog, status, error, retry } = useMovieCatalog()
  const results = query.trim() && status === 'success' ? searchMovies(catalog, query) : []
  const categoryCount = summarizeCategories(results)

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
          <SearchForm query={query} onQueryChange={setQuery} />
        </section>

        <section
          className="results"
          aria-labelledby="results-title"
          aria-busy={status === 'loading'}
        >
          <h2 id="results-title">Resultados</h2>
          <ResultsSummary
            status={status}
            error={error}
            onRetry={retry}
            query={query}
            resultCount={results.length}
            categoryCount={categoryCount}
          />
          {results.length > 0 && <MovieGrid movies={results} />}
        </section>
      </main>

      <footer className="site-footer">
        <p>Cinebusca · Descubre tu próxima película</p>
      </footer>
    </>
  )
}

export default App

import './App.css'

function App() {
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

          <form className="search-form" role="search">
            <label htmlFor="movie-query">Título de la película</label>
            <div className="search-controls">
              <input
                id="movie-query"
                name="query"
                type="search"
                placeholder="Ej.: El viaje de Chihiro"
                autoComplete="off"
              />
              <button type="button">Buscar</button>
            </div>
          </form>
        </section>

        <section className="results" aria-labelledby="results-title">
          <h2 id="results-title">Resultados</h2>
          <p className="search-status" role="status" aria-live="polite">
            Escribe el título de una película para empezar la búsqueda.
          </p>
          <div className="movie-results" aria-label="Películas encontradas" />
        </section>
      </main>

      <footer className="site-footer">
        <p>Cinebusca · Descubre tu próxima película</p>
      </footer>
    </>
  )
}

export default App

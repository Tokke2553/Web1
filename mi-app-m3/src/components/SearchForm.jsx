function SearchForm({ query, onQueryChange }) {
  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label htmlFor="movie-query">Título de la película</label>
      <div className="search-controls">
        <input
          id="movie-query"
          name="query"
          type="search"
          placeholder="Ej.: El viaje de Chihiro"
          autoComplete="off"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-describedby="search-status"
        />
        <button
          className="search-clear-button"
          type="button"
          disabled={!query}
          onClick={() => onQueryChange('')}
        >
          Limpiar
        </button>
      </div>
    </form>
  )
}

export default SearchForm

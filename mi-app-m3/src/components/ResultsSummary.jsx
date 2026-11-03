function ResultsSummary({ status, error, onRetry, query, resultCount, categoryCount }) {
  let message = 'Escribe el título de una película para empezar la búsqueda.'

  if (status === 'loading') {
    message = 'Cargando los catálogos de películas…'
  } else if (status === 'error') {
    message = `No se pudo cargar el catálogo. ${error.message} Inténtalo de nuevo más tarde.`
  } else if (query.trim() && resultCount === 0) {
    message = `No encontramos películas con “${query.trim()}”. Prueba con otro título.`
  } else if (query.trim()) {
    message = `${resultCount} ${resultCount === 1 ? 'película' : 'películas'} encontradas en ${categoryCount} ${categoryCount === 1 ? 'categoría' : 'categorías'}.`
  }

  return (
    <div
      className="search-status"
      id="search-status"
      role="status"
      aria-live="polite"
      data-state={status}
    >
      <span>{message}</span>
      {status === 'error' && (
        <button className="retry-button" type="button" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ResultsSummary

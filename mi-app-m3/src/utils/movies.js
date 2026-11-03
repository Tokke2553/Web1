function getMovieKey(movie) {
  return movie.imdbId || movie.title.toLocaleLowerCase()
}

export function normalizeMovieCatalog(categories) {
  const normalizedMovies = categories
    .flatMap(({ category, movies }) =>
      movies
        .filter((movie) => movie && typeof movie === 'object')
        .map((movie) => ({
          id: movie.imdbId || `${category}-${movie.id ?? movie.title}`,
          imdbId: typeof movie.imdbId === 'string' ? movie.imdbId : '',
          title: typeof movie.title === 'string' ? movie.title.trim() : '',
          posterURL: typeof movie.posterURL === 'string' ? movie.posterURL : '',
          categories: [category],
        }))
        .filter((movie) => movie.title),
    )
    .reduce((uniqueMovies, movie) => {
      const key = getMovieKey(movie)
      const existingMovie = uniqueMovies.get(key)

      if (existingMovie) {
        existingMovie.categories = [...new Set([...existingMovie.categories, ...movie.categories])]
      } else {
        uniqueMovies.set(key, movie)
      }

      return uniqueMovies
    }, new Map())

  return [...normalizedMovies.values()].sort((first, second) =>
    first.title.localeCompare(second.title),
  )
}

export function searchMovies(movies, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase()

  return movies.filter((movie) => movie.title.toLocaleLowerCase().includes(normalizedQuery))
}

export function summarizeCategories(movies) {
  return movies.reduce((categories, movie) => {
    movie.categories.forEach((category) => {
      categories.add(category)
    })

    return categories
  }, new Set()).size
}

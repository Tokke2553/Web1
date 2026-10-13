import { useState } from 'react'

function MovieCard({ movie }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasPoster = movie.posterURL && !imageFailed
  const imdbUrl = movie.imdbId ? `https://www.imdb.com/title/${movie.imdbId}/` : ''

  return (
    <article className="movie-card">
      {hasPoster ? (
        <img
          src={movie.posterURL}
          alt={`Póster de ${movie.title}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="movie-poster-placeholder" aria-label={`Póster no disponible para ${movie.title}`}>
          <span aria-hidden="true">🎬</span>
          <span>Póster no disponible</span>
        </div>
      )}
      <div className="movie-card-info">
        <h3>
          {imdbUrl ? (
            <a href={imdbUrl} target="_blank" rel="noreferrer">
              {movie.title}
            </a>
          ) : (
            movie.title
          )}
        </h3>
        <p>{movie.categories.join(' · ')}</p>
      </div>
    </article>
  )
}

export default MovieCard

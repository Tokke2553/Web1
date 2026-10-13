import assert from 'node:assert/strict'
import test from 'node:test'
import { normalizeMovieCatalog, searchMovies, summarizeCategories } from '../src/utils/movies.js'

const categories = [
  {
    category: 'Animación',
    movies: [
      { id: 1, imdbId: 'tt001', title: ' Toy Story ', posterURL: 'toy-story.jpg' },
      { id: 2, title: 'Totoro', posterURL: '' },
      null,
      { id: 3, title: '' },
    ],
  },
  {
    category: 'Familiar',
    movies: [
      { id: 4, imdbId: 'tt001', title: 'Toy Story', posterURL: 'toy-story.jpg' },
      { id: 5, title: 'Mi vecino Totoro', posterURL: '' },
    ],
  },
]

test('normalizes movies, skips invalid entries, and merges duplicate categories', () => {
  const movies = normalizeMovieCatalog(categories)
  const toyStory = movies.find((movie) => movie.title === 'Toy Story')

  assert.equal(movies.length, 3)
  assert.deepEqual(toyStory.categories, ['Animación', 'Familiar'])
})

test('searches titles without case or surrounding-space sensitivity', () => {
  const movies = normalizeMovieCatalog(categories)

  assert.deepEqual(
    searchMovies(movies, '  TOY ').map((movie) => movie.title),
    ['Toy Story'],
  )
})

test('returns no matches for a title outside the catalog', () => {
  const movies = normalizeMovieCatalog(categories)

  assert.deepEqual(searchMovies(movies, 'not a movie'), [])
})

test('counts each matching category once', () => {
  const movies = normalizeMovieCatalog(categories)
  const results = searchMovies(movies, 'totoro')

  assert.equal(summarizeCategories(results), 2)
})

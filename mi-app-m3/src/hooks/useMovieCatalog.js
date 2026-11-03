import { useEffect, useState } from 'react'
import { getMovieCatalog } from '../api/movies.js'
import { normalizeMovieCatalog } from '../utils/movies.js'

const initialState = {
  movies: [],
  status: 'loading',
  error: null,
}

export function useMovieCatalog() {
  const [state, setState] = useState(initialState)
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadCatalog() {
      setState((currentState) => ({
        ...currentState,
        status: 'loading',
        error: null,
      }))

      try {
        const categories = await getMovieCatalog()

        if (isMounted) {
          setState({
            movies: normalizeMovieCatalog(categories),
            status: 'success',
            error: null,
          })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            movies: [],
            status: 'error',
            error: error instanceof Error ? error : new Error(String(error)),
          })
        }
      }
    }

    loadCatalog()

    return () => {
      isMounted = false
    }
  }, [requestNumber])

  function retry() {
    setRequestNumber((currentRequest) => currentRequest + 1)
  }

  return { ...state, retry }
}

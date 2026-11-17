import { parseProposalList, parseProposalResponse } from '../schemas/proposal.js'

const API_URL = 'http://localhost:3001/proposals'

async function request(url, options) {
  let response

  try {
    response = await fetch(url, options)
  } catch (error) {
    throw new Error(
      'No se pudo conectar con la API local. Comprueba que npm run dev:api esté activo.',
      { cause: error },
    )
  }

  if (!response.ok) {
    throw new Error(`La API respondió con un error (${response.status}).`)
  }

  try {
    return await response.json()
  } catch (error) {
    throw new Error('La API respondió con un contenido que no es JSON válido.', { cause: error })
  }
}

export const proposalKeys = {
  all: ['proposals'],
  list: ['proposals', 'list'],
}

export async function getProposals() {
  const payload = await request(API_URL)
  return parseProposalList(payload).sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
  )
}

export async function createProposal(values) {
  const payload = await request(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...values, duration: Number(values.duration), createdAt: new Date().toISOString() }),
  })

  return parseProposalResponse(payload)
}

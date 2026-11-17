import assert from 'node:assert/strict'
import test from 'node:test'
import {
  parseProposalList,
  parseProposalResponse,
  proposalFormSchema,
} from '../src/schemas/proposal.js'

const validProposal = {
  speakerName: '  Alex García  ',
  email: 'alex@example.com',
  title: 'Diseñar productos para todos',
  category: 'charla',
  duration: '30',
  abstract:
    'Una conversación práctica sobre cómo crear productos digitales útiles, accesibles y fáciles de entender para diferentes comunidades.',
}

test('trims text fields and converts duration to a number', () => {
  const proposal = proposalFormSchema.parse(validProposal)

  assert.equal(proposal.speakerName, 'Alex García')
  assert.equal(proposal.duration, 30)
})

test('reports useful validation errors for short summaries and invalid email', () => {
  const result = proposalFormSchema.safeParse({
    ...validProposal,
    email: 'no-es-un-correo',
    abstract: 'Muy corto.',
  })

  assert.equal(result.success, false)
  assert.deepEqual(
    result.error.issues.map((issue) => issue.path[0]),
    ['email', 'abstract'],
  )
})

test('rejects a corrupt API response instead of returning unvalidated data', () => {
  assert.throws(
    () =>
      parseProposalResponse({
        ...validProposal,
        id: 8,
        createdAt: '2026-11-17T10:00:00.000Z',
        duration: 30,
        speakerName: '',
      }),
    /speakerName/,
  )
})

test('rejects a malformed proposal from the API with a visible error', () => {
  assert.throws(
    () => parseProposalList([{ id: 1, title: 'Dato roto' }]),
    /formato inválido/,
  )
})

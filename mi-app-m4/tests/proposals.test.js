import assert from 'node:assert/strict'
import test from 'node:test'
import { parseProposalList, proposalFormSchema } from '../src/schemas/proposal.js'

const validProposal = {
  speakerName: '  Alex García  ',
  email: 'alex@example.com',
  title: 'Diseñar productos para todos',
  category: 'charla',
  abstract:
    'Una conversación práctica sobre cómo crear productos digitales útiles y accesibles para distintas comunidades.',
}

test('trims text fields', () => {
  const proposal = proposalFormSchema.parse(validProposal)

  assert.equal(proposal.speakerName, 'Alex García')
})

test('rejects invalid email and a short summary', () => {
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

test('catches a corrupt API response with Zod safeParse', () => {
  assert.throws(
    () => parseProposalList([{ id: 1, title: 'Dato roto' }]),
    /datos inválidos/,
  )
})

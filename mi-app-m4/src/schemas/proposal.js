import { z } from 'zod'

export const proposalCategories = ['charla', 'taller', 'mesa-redonda']

export const proposalFormSchema = z.object({
  speakerName: z.string().trim().min(3, 'Escribe al menos 3 caracteres.'),
  email: z.string().trim().email('Introduce un correo válido.'),
  title: z.string().trim().min(8, 'El título debe tener al menos 8 caracteres.'),
  category: z.enum(proposalCategories, { error: 'Elige un formato.' }),
  abstract: z
    .string()
    .trim()
    .min(30, 'El resumen debe tener al menos 30 caracteres.')
    .max(400, 'El resumen no puede superar los 400 caracteres.'),
})

const proposalResponseSchema = proposalFormSchema.extend({
  id: z.union([z.number(), z.string()]),
  createdAt: z.iso.datetime(),
})

function parseResponse(schema, payload) {
  const result = schema.safeParse(payload)

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'respuesta'}: ${issue.message}`)
      .join('; ')
    throw new Error(`La API devolvió datos inválidos. ${details}`)
  }

  return result.data
}

export function parseProposalList(payload) {
  return parseResponse(z.array(proposalResponseSchema), payload)
}

export function parseProposal(payload) {
  return parseResponse(proposalResponseSchema, payload)
}

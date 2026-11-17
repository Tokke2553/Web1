import { z } from 'zod'

export const proposalCategories = ['charla', 'taller', 'mesa-redonda', 'panel']

export const proposalFormSchema = z.object({
  speakerName: z
    .string()
    .trim()
    .min(3, 'Escribe al menos 3 caracteres.')
    .max(70, 'El nombre no puede superar los 70 caracteres.'),
  email: z
    .string()
    .trim()
    .email('Introduce un correo electrónico válido.')
    .max(120, 'El correo no puede superar los 120 caracteres.'),
  title: z
    .string()
    .trim()
    .min(8, 'El título debe tener al menos 8 caracteres.')
    .max(90, 'El título no puede superar los 90 caracteres.'),
  category: z.enum(proposalCategories, { error: 'Elige un formato.' }),
  duration: z.coerce
    .number()
    .int('La duración debe ser un número entero de minutos.')
    .min(10, 'La duración mínima es de 10 minutos.')
    .max(90, 'La duración máxima es de 90 minutos.'),
  abstract: z
    .string()
    .trim()
    .min(60, 'El resumen debe tener al menos 60 caracteres.')
    .max(600, 'El resumen no puede superar los 600 caracteres.'),
})

export const proposalResponseSchema = proposalFormSchema.extend({
  id: z.union([z.number(), z.string()]),
  createdAt: z.iso.datetime(),
})

export const proposalListResponseSchema = z.array(proposalResponseSchema)

function describeIssues(issues) {
  return issues
    .map((issue) => `${issue.path.join('.') || 'respuesta'}: ${issue.message}`)
    .join('; ')
}

export function parseProposalList(payload) {
  const result = proposalListResponseSchema.safeParse(payload)

  if (!result.success) {
    throw new Error(`La API devolvió propuestas con un formato inválido. ${describeIssues(result.error.issues)}`)
  }

  return result.data
}

export function parseProposalResponse(payload) {
  const result = proposalResponseSchema.safeParse(payload)

  if (!result.success) {
    throw new Error(`La API devolvió una propuesta con un formato inválido. ${describeIssues(result.error.issues)}`)
  }

  return result.data
}

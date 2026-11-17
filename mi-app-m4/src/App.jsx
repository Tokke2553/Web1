import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProposal, getProposals, proposalKeys } from './api/proposals.js'
import { proposalCategories, proposalFormSchema } from './schemas/proposal.js'
import './App.css'

const categoryLabels = {
  charla: 'Charla',
  taller: 'Taller',
  'mesa-redonda': 'Mesa redonda',
}

function FieldError({ id, message }) {
  return message ? (
    <span className="field-error" id={id} role="alert">
      {message}
    </span>
  ) : null
}

function App() {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      speakerName: '',
      email: '',
      title: '',
      category: '',
      abstract: '',
    },
  })

  const proposalsQuery = useQuery({
    queryKey: proposalKeys.list,
    queryFn: getProposals,
    retry: 1,
  })

  const createMutation = useMutation({
    mutationFn: createProposal,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: proposalKeys.list })
      reset()
    },
  })

  const onSubmit = (values) => createMutation.mutate(values)

  return (
    <div className="page">
      <header className="site-header">
        <a className="brand" href="#inicio">Foro Abierto</a>
        <a href="#propuestas">Ver propuestas ↓</a>
      </header>

      <main id="inicio">
        <section className="intro">
          <p className="eyebrow">Convocatoria abierta · 2026</p>
          <h1>Las ideas merecen un escenario.</h1>
          <p>Presenta una charla, un taller o una conversación para nuestro próximo encuentro.</p>
        </section>

        <section className="panel" aria-labelledby="form-title">
          <h2 id="form-title">Envía tu propuesta</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="speakerName">Nombre</label>
                <input
                  id="speakerName"
                  autoComplete="name"
                  aria-invalid={Boolean(errors.speakerName)}
                  aria-describedby={errors.speakerName ? 'speakerName-error' : undefined}
                  {...register('speakerName')}
                />
                <FieldError id="speakerName-error" message={errors.speakerName?.message} />
              </div>

              <div className="field">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
                <FieldError id="email-error" message={errors.email?.message} />
              </div>

              <div className="field">
                <label htmlFor="title">Título</label>
                <input
                  id="title"
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  {...register('title')}
                />
                <FieldError id="title-error" message={errors.title?.message} />
              </div>

              <div className="field">
                <label htmlFor="category">Formato</label>
                <select
                  id="category"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                  {...register('category')}
                >
                  <option value="">Elige una opción</option>
                  {proposalCategories.map((category) => (
                    <option key={category} value={category}>
                      {categoryLabels[category]}
                    </option>
                  ))}
                </select>
                <FieldError id="category-error" message={errors.category?.message} />
              </div>

              <div className="field field-wide">
                <label htmlFor="abstract">Resumen (30–400 caracteres)</label>
                <textarea
                  id="abstract"
                  rows="4"
                  aria-invalid={Boolean(errors.abstract)}
                  aria-describedby={errors.abstract ? 'abstract-error' : undefined}
                  {...register('abstract')}
                />
                <FieldError id="abstract-error" message={errors.abstract?.message} />
              </div>
            </div>

            {createMutation.isError && (
              <p className="feedback error" role="alert">
                No se pudo enviar la propuesta. {createMutation.error.message}
              </p>
            )}
            {createMutation.isSuccess && (
              <p className="feedback success" role="status">
                Propuesta enviada correctamente.
              </p>
            )}

            <button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Enviando…' : 'Enviar propuesta'}
            </button>
          </form>
        </section>

        <section className="proposals" id="propuestas" aria-labelledby="proposals-title">
          <h2 id="proposals-title">Propuestas recibidas</h2>
          <div aria-live="polite" aria-busy={proposalsQuery.isPending}>
            {proposalsQuery.isPending && <p>Cargando propuestas…</p>}
            {proposalsQuery.isError && (
              <div className="feedback error" role="alert">
                <p>No se pudieron cargar las propuestas. {proposalsQuery.error.message}</p>
                <button type="button" onClick={() => proposalsQuery.refetch()}>
                  Volver a intentar
                </button>
              </div>
            )}
            {proposalsQuery.isSuccess && proposalsQuery.data.length === 0 && (
              <p>Todavía no hay propuestas.</p>
            )}
          </div>

          {proposalsQuery.isSuccess && proposalsQuery.data.length > 0 && (
            <ul className="proposal-list">
              {proposalsQuery.data.map((proposal) => (
                <li className="proposal-card" key={proposal.id}>
                  <span className="category">{categoryLabels[proposal.category]}</span>
                  <h3>{proposal.title}</h3>
                  <p>{proposal.abstract}</p>
                  <p className="speaker">
                    {proposal.speakerName} · {proposal.email}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer>Foro Abierto · Las ideas crecen cuando se comparten.</footer>
    </div>
  )
}

export default App

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProposal, getProposals, proposalKeys } from './api/proposals.js'
import { proposalCategories, proposalFormSchema } from './schemas/proposal.js'
import './App.css'

const categoryLabels = {
  charla: 'Charla',
  taller: 'Taller',
  'mesa-redonda': 'Mesa redonda',
  panel: 'Panel',
}

function FieldError({ id, children }) {
  if (!children) return null

  return (
    <span className="field-error" id={id} role="alert">
      {children}
    </span>
  )
}

function ProposalForm({ onCreated }) {
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
      duration: '',
      abstract: '',
    },
  })

  const mutation = useMutation({
    mutationFn: createProposal,
    onSuccess: async () => {
      await onCreated()
      reset()
    },
  })

  const onSubmit = (values) => {
    mutation.mutate(values)
  }

  return (
    <form className="proposal-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-heading">
        <p className="section-kicker">01 / Presenta tu idea</p>
        <h2>Tu propuesta empieza aquí.</h2>
        <p>Cuéntanos qué quieres compartir. Revisaremos cada envío con atención.</p>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="speakerName">Nombre del ponente</label>
          <input
            id="speakerName"
            autoComplete="name"
            placeholder="Tu nombre y apellidos"
            aria-invalid={Boolean(errors.speakerName)}
            aria-describedby={errors.speakerName ? 'speakerName-error' : undefined}
            {...register('speakerName')}
          />
          <FieldError id="speakerName-error">{errors.speakerName?.message}</FieldError>
        </div>

        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@ejemplo.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          <FieldError id="email-error">{errors.email?.message}</FieldError>
        </div>

        <div className="field field-wide">
          <label htmlFor="title">Título de la propuesta</label>
          <input
            id="title"
            placeholder="Una frase que despierte curiosidad"
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
            {...register('title')}
          />
          <FieldError id="title-error">{errors.title?.message}</FieldError>
        </div>

        <div className="field">
          <label htmlFor="category">Formato</label>
          <select
            id="category"
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'category-error' : undefined}
            {...register('category')}
          >
            <option value="">Elige un formato</option>
            {proposalCategories.map((category) => (
              <option key={category} value={category}>
                {categoryLabels[category]}
              </option>
            ))}
          </select>
          <FieldError id="category-error">{errors.category?.message}</FieldError>
        </div>

        <div className="field">
          <label htmlFor="duration">Duración aproximada</label>
          <div className="input-suffix">
            <input
              id="duration"
              type="number"
              min="10"
              max="90"
              placeholder="30"
              aria-invalid={Boolean(errors.duration)}
              aria-describedby={errors.duration ? 'duration-error' : 'duration-hint'}
              {...register('duration')}
            />
            <span id="duration-hint">min</span>
          </div>
          <FieldError id="duration-error">{errors.duration?.message}</FieldError>
        </div>

        <div className="field field-wide">
          <label htmlFor="abstract">Resumen de la propuesta</label>
          <textarea
            id="abstract"
            rows="5"
            placeholder="¿Qué aprenderá o descubrirá el público?"
            aria-invalid={Boolean(errors.abstract)}
            aria-describedby={errors.abstract ? 'abstract-error' : 'abstract-hint'}
            {...register('abstract')}
          />
          <div className="field-meta">
            <FieldError id="abstract-error">{errors.abstract?.message}</FieldError>
            {!errors.abstract && <span id="abstract-hint">Entre 60 y 600 caracteres.</span>}
          </div>
        </div>
      </div>

      {mutation.isError && (
        <p className="form-feedback feedback-error" role="alert">
          No se pudo guardar la propuesta. {mutation.error.message}
        </p>
      )}
      {mutation.isSuccess && (
        <p className="form-feedback feedback-success" role="status">
          Propuesta recibida. Gracias por compartir tu idea.
        </p>
      )}

      <div className="form-actions">
        <p>Los campos son necesarios para poder revisar tu propuesta.</p>
        <button className="submit-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Enviando…' : 'Enviar propuesta'}
          {!mutation.isPending && <span aria-hidden="true">↗</span>}
        </button>
      </div>
    </form>
  )
}

function ProposalCard({ proposal, index }) {
  const date = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(
    new Date(proposal.createdAt),
  )

  return (
    <article className="proposal-card">
      <div className="card-topline">
        <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="category-tag">{categoryLabels[proposal.category]}</span>
      </div>
      <h3>{proposal.title}</h3>
      <p className="proposal-abstract">{proposal.abstract}</p>
      <div className="card-details">
        <span>{proposal.speakerName}</span>
        <span>{proposal.duration} min</span>
      </div>
      <time dateTime={proposal.createdAt}>{date}</time>
    </article>
  )
}

function App() {
  const queryClient = useQueryClient()
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const {
    data: proposals = [],
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: proposalKeys.list,
    queryFn: getProposals,
    retry: 1,
  })

  const visibleProposals =
    categoryFilter === 'todas'
      ? proposals
      : proposals.filter((proposal) => proposal.category === categoryFilter)

  return (
    <div className="page-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Foro Abierto, inicio">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>Foro Abierto</span>
        </a>
        <a className="header-link" href="#propuestas">
          Ver propuestas <span aria-hidden="true">↓</span>
        </a>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">✳</span> Convocatoria abierta · 2026</p>
            <h1 id="page-title">Las buenas ideas merecen <em>escenario.</em></h1>
            <p className="hero-intro">
              Un encuentro para compartir lo que sabes, lo que haces y lo que todavía estás
              imaginando. Propón una charla y construyamos algo juntos.
            </p>
            <a className="hero-cta" href="#propuesta">
              Presentar una propuesta <span aria-hidden="true">↘</span>
            </a>
          </div>
          <div className="hero-note" aria-label="Información de la convocatoria">
            <span className="note-line" aria-hidden="true"></span>
            <p>Una comunidad curiosa.<br />Un escenario para cada voz.</p>
            <span className="note-index">MADRID · 01—26</span>
          </div>
          <span className="hero-orbit orbit-one" aria-hidden="true"></span>
          <span className="hero-orbit orbit-two" aria-hidden="true"></span>
        </section>

        <section className="content-layout" id="propuesta" aria-label="Enviar propuesta">
          <aside className="aside-copy">
            <p className="section-kicker">La convocatoria</p>
            <h2>Comparte lo que te mueve.</h2>
            <p>
              Buscamos ideas cercanas, preguntas valientes y experiencias que merezcan ser
              compartidas. No hace falta tener todas las respuestas.
            </p>
            <div className="aside-detail">
              <span className="detail-dot" aria-hidden="true"></span>
              <p>Charlas, talleres y conversaciones abiertas.</p>
            </div>
            <div className="aside-detail">
              <span className="detail-dot" aria-hidden="true"></span>
              <p>Propuestas de 10 a 90 minutos.</p>
            </div>
            <a className="text-link" href="#propuestas">Explorar propuestas <span aria-hidden="true">↓</span></a>
          </aside>
          <ProposalForm
            onCreated={() =>
              queryClient.invalidateQueries({ queryKey: proposalKeys.list })
            }
          />
        </section>

        <section className="proposals-section" id="propuestas" aria-labelledby="proposals-title">
          <div className="list-heading">
            <div>
              <p className="section-kicker">02 / Ideas en circulación</p>
              <h2 id="proposals-title">Propuestas recibidas</h2>
            </div>
            <label className="filter-control">
              <span className="sr-only">Filtrar por formato</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="todas">Todos los formatos</option>
                {proposalCategories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="list-status" aria-live="polite" aria-busy={isPending || isFetching}>
            {isPending && <p className="status-message">Cargando propuestas…</p>}
            {isError && (
              <div className="status-message status-error" role="alert">
                <p>No se pudieron cargar las propuestas. {error.message}</p>
                <button type="button" className="retry-button" onClick={() => refetch()}>
                  Volver a intentar
                </button>
              </div>
            )}
            {!isPending && !isError && visibleProposals.length === 0 && (
              <p className="status-message">
                {proposals.length === 0
                  ? 'Aún no hay propuestas. ¿Te animas a enviar la primera?'
                  : 'No hay propuestas con este formato.'}
              </p>
            )}
          </div>

          {!isPending && !isError && visibleProposals.length > 0 && (
            <>
              <p className="result-count">
                {visibleProposals.length} {visibleProposals.length === 1 ? 'propuesta' : 'propuestas'}
                {isFetching && <span> · Actualizando…</span>}
              </p>
              <div className="proposal-grid">
                {visibleProposals.map((proposal, index) => (
                  <ProposalCard key={proposal.id} proposal={proposal} index={index} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>Foro Abierto</span>
        </a>
        <p>Las ideas crecen cuando se comparten.</p>
        <a href="#inicio" className="back-top">Volver arriba ↑</a>
      </footer>
    </div>
  )
}

export default App

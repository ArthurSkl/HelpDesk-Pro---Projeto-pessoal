import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ticketsApi } from '../api'

function TicketDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    ticketsApi.getById(id)
      .then((res) => setTicket(res.ticket))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja remover este chamado?')) return
    setDeleting(true)
    try {
      await ticketsApi.delete(id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('pt-BR')
  }

  const getStatusClass = (status) => {
    return `badge status-${status.toLowerCase().replaceAll(' ', '-')}`
  }

  if (loading) {
    return (
      <main className="app detail-page" data-cy="detail-page">
        <p className="loading-text">Carregando...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="app detail-page" data-cy="detail-page">
        <p className="error-text">Erro: {error}</p>
        <button className="btn-cancel" onClick={() => navigate('/dashboard')}>Voltar</button>
      </main>
    )
  }

  if (!ticket) {
    return (
      <main className="app detail-page" data-cy="detail-page">
        <p className="error-text">Chamado não encontrado</p>
        <button className="btn-cancel" onClick={() => navigate('/dashboard')}>Voltar</button>
      </main>
    )
  }

  return (
    <main className="app detail-page" data-cy="detail-page">
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <p className="eyebrow">HelpDesk Pro</p>
            <h1 data-cy="detail-title">{ticket.code}</h1>
          </div>
          <span className={getStatusClass(ticket.status_name)}>
            {ticket.status_name}
          </span>
        </div>

        <h2 className="detail-subject">{ticket.title}</h2>

        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">Categoria</span>
            <span>{ticket.category_name}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Prioridade</span>
            <span>{ticket.priority_name}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Solicitante</span>
            <span>{ticket.requester_name}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Responsável</span>
            <span>{ticket.assignee_name}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Criado em</span>
            <span>{formatDate(ticket.created_at)}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Atualizado em</span>
            <span>{formatDate(ticket.updated_at)}</span>
          </div>
          {ticket.resolved_at && (
            <div className="detail-field">
              <span className="detail-label">Resolvido em</span>
              <span>{formatDate(ticket.resolved_at)}</span>
            </div>
          )}
          {ticket.closed_at && (
            <div className="detail-field">
              <span className="detail-label">Encerrado em</span>
              <span>{formatDate(ticket.closed_at)}</span>
            </div>
          )}
        </div>

        <div className="detail-description">
          <span className="detail-label">Descrição</span>
          <p>{ticket.description}</p>
        </div>

        <div className="detail-actions">
          <button
            className="btn-cancel"
            onClick={() => navigate('/dashboard')}
            data-cy="detail-back"
          >
            Voltar
          </button>
          <button
            className="btn-edit"
            onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
            data-cy="detail-edit"
          >
            Editar
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={deleting}
            data-cy="detail-delete"
          >
            {deleting ? 'Removendo...' : 'Remover'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default TicketDetailsPage

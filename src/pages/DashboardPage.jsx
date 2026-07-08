import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ticketsApi } from '../api'

function DashboardPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFiltro, setStatusFiltro] = useState('Todos')

  const carregar = () => {
    setLoading(true)
    ticketsApi.list()
      .then((data) => {
        setTickets(Array.isArray(data) ? data : data.tickets ?? [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(carregar, [])

  const usuarioLogado = JSON.parse(localStorage.getItem('helpdesk_user'))

  const metricas = useMemo(() => {
    const abertos = tickets.filter((t) => t.status_name === 'Aberto').length
    const atendimento = tickets.filter((t) => t.status_name === 'Em Atendimento').length
    const resolvidos = tickets.filter((t) => t.status_name === 'Resolvido').length
    const encerrados = tickets.filter((t) => t.status_name === 'Encerrado').length

    return { abertos, atendimento, resolvidos, encerrados }
  }, [tickets])

  const chamadosFiltrados = useMemo(() => {
    if (statusFiltro === 'Todos') return tickets
    return tickets.filter((t) => t.status_name === statusFiltro)
  }, [tickets, statusFiltro])

  const handleLogout = () => {
    localStorage.removeItem('helpdesk_user')
    navigate('/login', { state: { message: 'Logout realizado com sucesso' } })
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Tem certeza que deseja remover este chamado?')) return
    try {
      await ticketsApi.delete(id)
      carregar()
    } catch (err) {
      setError(err.message)
    }
  }

  const getStatusClass = (status) => {
    return `badge status-${status.toLowerCase().replaceAll(' ', '-')}`
  }

  if (loading && tickets.length === 0) {
    return (
      <main className="app dashboard-page" data-cy="dashboard-page">
        <p className="loading-text">Carregando chamados...</p>
      </main>
    )
  }

  if (error && tickets.length === 0) {
    return (
      <main className="app dashboard-page" data-cy="dashboard-page">
        <p className="error-text">Erro ao carregar chamados: {error}</p>
      </main>
    )
  }

  return (
    <main className="app dashboard-page" data-cy="dashboard-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">HelpDesk Pro</p>
          <h1 data-cy="dashboard-title">Painel de Chamados</h1>
        </div>

        <div className="topbar-actions">
          <div className="user-box" data-cy="user-info">
            <strong>{usuarioLogado?.nome}</strong>
            <span>{usuarioLogado?.perfil}</span>
          </div>

          <button
            className="logout-btn"
            data-cy="logout-button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      <section className="metrics">
        <div className="metric-card" data-cy="metric-abertos">
          <span>Abertos</span>
          <strong>{metricas.abertos}</strong>
        </div>

        <div className="metric-card" data-cy="metric-atendimento">
          <span>Em atendimento</span>
          <strong>{metricas.atendimento}</strong>
        </div>

        <div className="metric-card" data-cy="metric-resolvidos">
          <span>Resolvidos</span>
          <strong>{metricas.resolvidos}</strong>
        </div>

        <div className="metric-card" data-cy="metric-encerrados">
          <span>Encerrados</span>
          <strong>{metricas.encerrados}</strong>
        </div>
      </section>

      <section className="tickets-section">
        <div className="section-header filters-header">
          <div>
            <p className="eyebrow">Operação</p>
            <h2 data-cy="tickets-title">Chamados recentes</h2>
          </div>

          <div className="filters-row">
            <div className="filters-box">
              <label htmlFor="statusFiltro">Filtrar por status</label>
              <select
                id="statusFiltro"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                data-cy="status-filter"
              >
                <option>Todos</option>
                <option>Aberto</option>
                <option>Em Atendimento</option>
                <option>Resolvido</option>
                <option>Encerrado</option>
              </select>
            </div>

            <button
              className="btn-new"
              onClick={() => navigate('/tickets/new')}
              data-cy="btn-new-ticket"
            >
              + Novo Chamado
            </button>
          </div>
        </div>

        <p className="results-info" data-cy="results-count">
          Exibindo {chamadosFiltrados.length} chamado(s)
        </p>

        <div className="table-wrapper">
          <table data-cy="tickets-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Responsável</th>
                <th className="th-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {chamadosFiltrados.map((chamado) => (
                <tr
                  key={chamado.id}
                  data-cy="ticket-row"
                  className="clickable-row"
                  onClick={() => navigate(`/tickets/${chamado.id}`)}
                >
                  <td>{chamado.code}</td>
                  <td>{chamado.title}</td>
                  <td>
                    <span className={getStatusClass(chamado.status_name)}>
                      {chamado.status_name}
                    </span>
                  </td>
                  <td>{chamado.priority_name}</td>
                  <td>{chamado.assignee_name}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn-icon btn-icon-edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/tickets/${chamado.id}/edit`)
                        }}
                        data-cy="btn-edit"
                        title="Editar"
                      >
                        Editar
                      </button>
                      <button
                        className="btn-icon btn-icon-delete"
                        onClick={(e) => handleDelete(chamado.id, e)}
                        data-cy="btn-delete"
                        title="Remover"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage

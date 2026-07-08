import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const chamadosMock = [
  {
    id: 'CH-1001',
    titulo: 'Erro ao acessar relatório financeiro',
    status: 'Aberto',
    prioridade: 'Alta',
    responsavel: 'Marina Souza',
  },
  {
    id: 'CH-1002',
    titulo: 'Reset de senha do usuário comercial',
    status: 'Em atendimento',
    prioridade: 'Média',
    responsavel: 'Carlos Lima',
  },
  {
    id: 'CH-1003',
    titulo: 'Sistema travando ao anexar arquivo',
    status: 'Resolvido',
    prioridade: 'Alta',
    responsavel: 'Arthur Frantz',
  },
  {
    id: 'CH-1004',
    titulo: 'Solicitação de novo acesso ao portal',
    status: 'Encerrado',
    prioridade: 'Baixa',
    responsavel: 'Juliana Rocha',
  },
]

function DashboardPage() {
  const navigate = useNavigate()
  const [statusFiltro, setStatusFiltro] = useState('Todos')

  const usuarioLogado = JSON.parse(localStorage.getItem('helpdesk_user'))

  const metricas = useMemo(() => {
    const abertos = chamadosMock.filter((item) => item.status === 'Aberto').length
    const atendimento = chamadosMock.filter((item) => item.status === 'Em atendimento').length
    const resolvidos = chamadosMock.filter((item) => item.status === 'Resolvido').length
    const encerrados = chamadosMock.filter((item) => item.status === 'Encerrado').length

    return { abertos, atendimento, resolvidos, encerrados }
  }, [])

  const chamadosFiltrados = useMemo(() => {
    if (statusFiltro === 'Todos') {
      return chamadosMock
    }

    return chamadosMock.filter((item) => item.status === statusFiltro)
  }, [statusFiltro])

  const handleLogout = () => {
    localStorage.removeItem('helpdesk_user')
    navigate('/login', { state: { message: 'Logout realizado com sucesso' } })
  }

  const getStatusClass = (status) => {
    return `badge status-${status.toLowerCase().replaceAll(' ', '-')}`
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
              <option>Em atendimento</option>
              <option>Resolvido</option>
              <option>Encerrado</option>
            </select>
          </div>
        </div>

        <p className="results-info" data-cy="results-count">
          Exibindo {chamadosFiltrados.length} chamado(s)
        </p>

        <div className="table-wrapper">
          <table data-cy="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {chamadosFiltrados.map((chamado) => (
                <tr key={chamado.id} data-cy="ticket-row">
                  <td>{chamado.id}</td>
                  <td>{chamado.titulo}</td>
                  <td>
                    <span className={getStatusClass(chamado.status)}>
                      {chamado.status}
                    </span>
                  </td>
                  <td>{chamado.prioridade}</td>
                  <td>{chamado.responsavel}</td>
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
import { useMemo, useState } from 'react'
import './App.css'

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

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [statusFiltro, setStatusFiltro] = useState('Todos')

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

  const handleLogin = (e) => {
    e.preventDefault()

    if (!email || !password) {
      setMessage('Preencha e-mail e senha')
      return
    }

    if (email === 'gestor@helpdesk.com' && password === '123456') {
      setUsuarioLogado({
        nome: 'Arthur Frantz',
        perfil: 'Gestor',
        email,
      })
      setMessage('')
      setEmail('')
      setPassword('')
      return
    }

    setMessage('Credenciais inválidas')
  }

  const handleLogout = () => {
    setUsuarioLogado(null)
    setMessage('Logout realizado com sucesso')
    setStatusFiltro('Todos')
  }

  if (usuarioLogado) {
    return (
      <div className="app dashboard-page" data-cy="dashboard-page">
        <header className="topbar">
          <div>
            <p className="eyebrow">HelpDesk Pro</p>
            <h1 data-cy="dashboard-title">Painel de Chamados</h1>
          </div>

          <div className="topbar-actions">
            <div className="user-box" data-cy="user-info">
              <strong>{usuarioLogado.nome}</strong>
              <span>{usuarioLogado.perfil}</span>
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
                      <span
                        className={`badge status-${chamado.status
                          .toLowerCase()
                          .replaceAll(' ', '-')}`}
                      >
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
      </div>
    )
  }

  return (
    <div className="app login-page">
      <div className="login-card">
        <p className="eyebrow">Projeto para entrevista</p>
        <h1>HelpDesk Pro</h1>
        <p className="subtitle">
          Sistema de gestão de chamados com automação E2E usando Cypress.
        </p>

        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="gestor@helpdesk.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-cy="login-email"
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-cy="login-password"
          />

          <button type="submit" data-cy="login-submit">
            Entrar
          </button>
        </form>

        {message && (
          <p className="message" data-cy="login-message">
            {message}
          </p>
        )}

        <div className="hint-box">
          <strong>Acesso para teste</strong>
          <span>E-mail: gestor@helpdesk.com</span>
          <span>Senha: 123456</span>
        </div>
      </div>
    </div>
  )
}

export default App
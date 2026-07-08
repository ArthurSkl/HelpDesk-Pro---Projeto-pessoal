import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
    }
  }, [location.state])

  const handleLogin = (e) => {
    e.preventDefault()

    if (!email || !password) {
      setMessage('Preencha e-mail e senha')
      return
    }

    if (email === 'gestor@helpdesk.com' && password === '123456') {
      const usuario = {
        nome: 'Arthur Frantz',
        perfil: 'Gestor',
        email,
      }

      localStorage.setItem('helpdesk_user', JSON.stringify(usuario))
      setMessage('')
      setEmail('')
      setPassword('')
      navigate('/dashboard')
      return
    }

    setMessage('Credenciais inválidas')
  }

  return (
    <main className="app login-page" data-cy="login-page">
      <section className="login-card">
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
      </section>
    </main>
  )
}

export default LoginPage
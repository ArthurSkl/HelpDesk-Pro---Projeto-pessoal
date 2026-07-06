import { useState } from 'react'
import './index.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    if (!email || !password) {
      setMessage('Preencha e-mail e senha')
      return
    }

    if (email === 'gestor@helpdesk.com' && password === '123456') {
      setMessage('Login realizado com sucesso')
      return
    }

    setMessage('Credenciais inválidas')
  }

  return (
    <main className="container">
      <div className="card">
        <h1 data-cy="login-title">Mini HelpDesk</h1>
        <p>Acesse o sistema para gerenciar chamados.</p>

        <form onSubmit={handleLogin} className="form">
          <input
            data-cy="login-email"
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            data-cy="login-password"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button data-cy="login-submit" type="submit">
            Entrar
          </button>
        </form>

        {message && (
          <p data-cy="login-message" className="message">
            {message}
          </p>
        )}
      </div>
    </main>
  )
}

export default App
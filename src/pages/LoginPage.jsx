import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../api'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [modo, setModo] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [animating, setAnimating] = useState(false)
  const formRef = useRef(null)

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message)
    }
  }, [location.state])

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setMessage('Preencha e-mail e senha')
      return
    }

    setSubmitting(true)
    try {
      const res = await authApi.login(email, password)
      const usuario = {
        id: res.user.id,
        nome: res.user.name,
        perfil: res.user.role,
        email: res.user.email,
      }
      localStorage.setItem('helpdesk_user', JSON.stringify(usuario))
      setMessage('')
      setEmail('')
      setPassword('')
      navigate('/dashboard')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!nome || !email || !password) {
      setMessage('Preencha todos os campos')
      return
    }

    if (password.length < 4) {
      setMessage('Senha deve ter no mínimo 4 caracteres')
      return
    }

    setSubmitting(true)
    try {
      await authApi.register({ name: nome, email, password })
      setNome('')
      setEmail('')
      setPassword('')
      await alternarModo()
      setMessage('Conta criada com sucesso! Faça login.')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const alternarModo = async () => {
    if (animating) return
    setAnimating(true)
    setMessage('')

    if (formRef.current) {
      formRef.current.style.transition = 'all 0.25s ease'
      formRef.current.style.opacity = '0'
      formRef.current.style.transform = 'translateY(8px)'
    }

    await new Promise(r => setTimeout(r, 200))
    setModo(modo === 'login' ? 'register' : 'login')
    await new Promise(r => setTimeout(r, 50))

    if (formRef.current) {
      formRef.current.style.opacity = '1'
      formRef.current.style.transform = 'translateY(0)'
    }

    setTimeout(() => setAnimating(false), 250)
  }

  return (
    <main className="app login-page" data-cy="login-page">
      <section className="login-card">
        <p className="eyebrow">Projeto para entrevista</p>
        <h1>HelpDesk Pro</h1>
        <p className="subtitle" key={modo}>
          {modo === 'login'
            ? 'Faça login para gerenciar seus chamados.'
            : 'Crie sua conta e comece a usar o sistema.'}
        </p>

        <div ref={formRef} style={{ transition: 'all 0.25s ease' }}>
          {modo === 'login' ? (
            <form onSubmit={handleLogin} className="login-form">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                data-cy="login-email"
              />

              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                data-cy="login-password"
              />

              <button type="submit" disabled={submitting} data-cy="login-submit">
                {submitting ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="login-form">
              <label htmlFor="regNome">Nome</label>
              <input
                id="regNome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={submitting}
                data-cy="reg-name"
              />

              <label htmlFor="regEmail">E-mail</label>
              <input
                id="regEmail"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                data-cy="reg-email"
              />

              <label htmlFor="regPassword">Senha</label>
              <input
                id="regPassword"
                type="password"
                placeholder="Mínimo 4 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                data-cy="reg-password"
              />

              <button type="submit" disabled={submitting} data-cy="reg-submit">
                {submitting ? 'Criando...' : 'Criar Conta'}
              </button>
            </form>
          )}
        </div>

        {message && (
          <p className="message" data-cy="login-message" key={message}>
            {message}
          </p>
        )}

        <div className="auth-toggle">
          {modo === 'login' ? (
            <p>
              Não tem conta?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={alternarModo}
                disabled={animating}
                data-cy="toggle-register"
              >
                Cadastre-se
              </button>
            </p>
          ) : (
            <p>
              Já tem conta?{' '}
              <button
                type="button"
                className="link-btn"
                onClick={alternarModo}
                disabled={animating}
                data-cy="toggle-login"
              >
                Faça login
              </button>
            </p>
          )}
        </div>

        {modo === 'login' && (
          <div className="hint-box">
            <strong>Acesso para teste</strong>
            <span>E-mail: gestor@helpdesk.com</span>
            <span>Senha: 123456</span>
            <span className="hint-note">(usuário pré-cadastrado no banco)</span>
          </div>
        )}
      </section>
    </main>
  )
}

export default LoginPage

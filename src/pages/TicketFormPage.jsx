import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ticketsApi, referencesApi } from '../api'

function TicketFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [statuses, setStatuses] = useState([])
  const [priorities, setPriorities] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])

  const usuarioLogado = JSON.parse(localStorage.getItem('helpdesk_user')) || {}

  const defaultRequesterId = usuarioLogado.id?.toString() || '1'

  const [form, setForm] = useState({
    title: '',
    description: '',
    requester_id: defaultRequesterId,
    assignee_id: '',
    category_id: '',
    status_id: '',
    priority_id: '',
  })

  useEffect(() => {
    Promise.all([
      referencesApi.statuses(),
      referencesApi.priorities(),
      referencesApi.categories(),
      referencesApi.users(),
    ])
      .then(([s, p, c, u]) => {
        setStatuses(s)
        setPriorities(p)
        setCategories(c)
        setUsers(u)
      })
      .catch(() => setError('Erro ao carregar dados do formulário'))

    if (isEditing) {
      ticketsApi.getById(id)
        .then((res) => {
          const t = res.ticket
          setForm({
            title: t.title || '',
            description: t.description || '',
            requester_id: t.requester_id?.toString() || usuarioLogado.id?.toString() || '',
            assignee_id: t.assignee_id?.toString() || '',
            category_id: t.category_id?.toString() || '',
            status_id: t.status_id?.toString() || '',
            priority_id: t.priority_id?.toString() || '',
          })
        })
        .catch(() => setError('Erro ao carregar ticket'))
        .finally(() => setLoading(false))
    }
  }, [id, isEditing])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      requester_id: Number(form.requester_id),
      assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
      category_id: Number(form.category_id),
      status_id: Number(form.status_id),
      priority_id: Number(form.priority_id),
    }

    try {
      if (isEditing) {
        await ticketsApi.update(id, payload)
      } else {
        await ticketsApi.create(payload)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="app form-page" data-cy="form-page">
        <p className="loading-text">Carregando...</p>
      </main>
    )
  }

  return (
    <main className="app form-page" data-cy="form-page">
      <div className="form-card">
        <p className="eyebrow">HelpDesk Pro</p>
        <h1>{isEditing ? 'Editar Chamado' : 'Novo Chamado'}</h1>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="ticket-form">
          <label htmlFor="title">Título *</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            data-cy="form-title"
          />

          <label htmlFor="description">Descrição *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            data-cy="form-description"
          />

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category_id">Categoria *</label>
              <select
                id="category_id"
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
                required
                data-cy="form-category"
              >
                <option value="">Selecione</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority_id">Prioridade *</label>
              <select
                id="priority_id"
                name="priority_id"
                value={form.priority_id}
                onChange={handleChange}
                required
                data-cy="form-priority"
              >
                <option value="">Selecione</option>
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status_id">Status *</label>
              <select
                id="status_id"
                name="status_id"
                value={form.status_id}
                onChange={handleChange}
                required
                data-cy="form-status"
              >
                <option value="">Selecione</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assignee_id">Responsável</label>
              <select
                id="assignee_id"
                name="assignee_id"
                value={form.assignee_id}
                onChange={handleChange}
                data-cy="form-assignee"
              >
                <option value="">Não atribuído</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/dashboard')}
              data-cy="form-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={saving}
              data-cy="form-submit"
            >
              {saving ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Chamado'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default TicketFormPage

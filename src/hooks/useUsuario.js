import { useCallback } from 'react'

const STORAGE_KEY = 'helpdesk_user'

export function useUsuario() {
  const getUsuario = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!parsed || !parsed.id) return null
      return parsed
    } catch {
      return null
    }
  }, [])

  const setUsuario = useCallback((usuario) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario))
  }, [])

  const clearUsuario = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { getUsuario, setUsuario, clearUsuario }
}

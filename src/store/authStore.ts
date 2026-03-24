import { create } from 'zustand'
import { authService, userService } from '../services/api'
import { tokenStorage, ApiError } from '../services/api/client'

const USER_KEY = 'hcm_user'
const userStorage = {
  get: (): User | null => {
    try {
      const raw = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null')
      if (!raw) return null
      return { healthScoreEnabled: true, ...raw }
    } catch { return null }
  },
  set:    (u: User) => localStorage.setItem(USER_KEY, JSON.stringify(u)),
  remove: ()        => localStorage.removeItem(USER_KEY),
}

interface User {
  id:                 string
  name:               string
  email:              string
  healthScoreEnabled: boolean
}

interface AuthState {
  user:                   User | null
  isAuthenticated:        boolean
  isLoading:              boolean
  error:                  string | null

  login:                  (email: string, password: string) => Promise<void>
  register:               (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle:        () => Promise<void>
  logout:                 () => void
  clearError:             () => void
  setHealthScoreEnabled:  (enabled: boolean) => Promise<void>
  /** Restaura sessão a partir do token salvo no localStorage */
  hydrate:                () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            userStorage.get(),
  isAuthenticated: !!tokenStorage.get(),
  isLoading:       false,
  error:           null,

  /* ── Login com e-mail/senha ──────────────────────────────────────────── */
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await authService.login({ email, password })
      userStorage.set(res.user)
      set({
        user:            res.user,
        isAuthenticated: true,
        isLoading:       false,
      })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao fazer login'
      set({ error: msg, isLoading: false })
    }
  },

  /* ── Cadastro ────────────────────────────────────────────────────────── */
  register: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await authService.register({ name, email, password })
      userStorage.set(res.user)
      set({
        user:            res.user,
        isAuthenticated: true,
        isLoading:       false,
      })
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Erro ao criar conta'
      set({ error: msg, isLoading: false })
    }
  },

  /* ── Google OAuth (placeholder — integrar SDK do Google) ────────────── */
  loginWithGoogle: async () => {
    set({ isLoading: true, error: null })
    try {
      // TODO: integrar Google Identity Services + enviar id_token para /auth/google
      await new Promise(r => setTimeout(r, 800))
      set({ isLoading: false, error: 'Google OAuth ainda não configurado.' })
    } catch {
      set({ error: 'Erro ao entrar com Google.', isLoading: false })
    }
  },

  /* ── Logout ──────────────────────────────────────────────────────────── */
  logout: () => {
    authService.logout()
    userStorage.remove()
    set({ user: null, isAuthenticated: false, error: null })
  },

  /* ── Restaura sessão do localStorage ao iniciar o app ───────────────── */
  hydrate: () => {
    const token = tokenStorage.get()
    if (!token) return

    // O token existe mas não temos os dados do user em memória.
    // Idealmente chamar GET /auth/me — por ora marcamos como autenticado
    // e o primeiro request com 401 fará o auto-logout.
    set({ isAuthenticated: true })
    // TODO: fetch('/auth/me').then(user => set({ user }))
  },

  clearError: () => set({ error: null }),

  /* ── Preferência: health score ───────────────────────────────────────── */
  setHealthScoreEnabled: async (enabled) => {
    // optimistic update
    set(state => {
      if (!state.user) return {}
      const updated = { ...state.user, healthScoreEnabled: enabled }
      userStorage.set(updated)
      return { user: updated }
    })
    try {
      await userService.updatePreferences({ healthScoreEnabled: enabled })
    } catch {
      // rollback
      set(state => {
        if (!state.user) return {}
        const reverted = { ...state.user, healthScoreEnabled: !enabled }
        userStorage.set(reverted)
        return { user: reverted }
      })
    }
  },
}))

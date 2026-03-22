import { http, tokenStorage } from './client'
import type { AuthResponse, LoginRequest, RegisterRequest } from '../../types/api.types'

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await http.post<AuthResponse>('/auth/login', data)
    tokenStorage.set(res.accessToken ?? '')
    return res
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await http.post<AuthResponse>('/auth/register', data)
    tokenStorage.set(res.accessToken ?? '')
    return res
  },

  logout() {
    tokenStorage.remove()
  },
}

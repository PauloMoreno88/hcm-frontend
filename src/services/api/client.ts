import type { ApiErrorBody } from '../../types/api.types'

/* ─────────────────────────────────────────────
   HTTP Client
   Wrapper em torno do fetch nativo com:
   - Base URL via VITE_API_URL
   - Bearer token automático (JWT do localStorage)
   - Tipagem de resposta
   - Tratamento centralizado de erros
   - Auto-logout em 401
─────────────────────────────────────────────── */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
const TOKEN_KEY = 'hcm_access_token'

/* ── Token helpers ──────────────────────────────────────────────────────── */
export const tokenStorage = {
  get:    ()          => localStorage.getItem(TOKEN_KEY),
  set:    (t: string) => localStorage.setItem(TOKEN_KEY, t),
  remove: ()          => localStorage.removeItem(TOKEN_KEY),
}

/* ── Erro tipado ────────────────────────────────────────────────────────── */
export class ApiError extends Error {
  readonly status: number
  readonly body?:  ApiErrorBody

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message)
    this.name   = 'ApiError'
    this.status = status
    this.body   = body
  }
}

/* ── Headers padrão ─────────────────────────────────────────────────────── */
function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({ 'Content-Type': 'application/json', ...extra })
  const token = tokenStorage.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return headers
}

/* ── Processa resposta ──────────────────────────────────────────────────── */
async function handleResponse<T>(res: Response): Promise<T> {
  // Sem conteúdo (204 Delete, etc.)
  if (res.status === 204) return undefined as T

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    // 401 → limpa sessão e redireciona para login
    if (res.status === 401) {
      tokenStorage.remove()
      window.location.href = '/login'
    }

    const message =
      (json as ApiErrorBody)?.message
        ? Array.isArray((json as ApiErrorBody).message)
          ? ((json as ApiErrorBody).message as string[]).join(', ')
          : (json as ApiErrorBody).message as string
        : res.statusText

    throw new ApiError(res.status, message, json ?? undefined)
  }

  return json as T
}

/* ── Métodos principais ─────────────────────────────────────────────────── */
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  'GET',
    headers: buildHeaders(),
  })
  return handleResponse<T>(res)
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  'POST',
    headers: buildHeaders(),
    body:    body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  'PATCH',
    headers: buildHeaders(),
    body:    body !== undefined ? JSON.stringify(body) : undefined,
  })
  return handleResponse<T>(res)
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  'DELETE',
    headers: buildHeaders(),
  })
  return handleResponse<T>(res)
}

export const http = { get, post, patch, delete: del }

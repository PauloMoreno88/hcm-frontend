/* ── Auth ─────────────────────────────────────────────────────────────────── */
export interface LoginRequest {
  email:    string
  password: string
}

export interface RegisterRequest {
  name:     string
  email:    string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: {
    id:                 string
    name:               string
    email:              string
    healthScoreEnabled: boolean
  }
}

/* ── Vehicle ──────────────────────────────────────────────────────────────── */
export interface Vehicle {
  id:          string
  nickname:    string
  brand:       string
  model:       string
  year:        number
  plate:       string
  healthScore: number
  odometer:    number
  userId:      string
  createdAt:   string
  updatedAt:   string
}

export interface CreateVehicleRequest {
  nickname:  string
  brand:     string
  model:     string
  year:      number
  plate?:    string
  odometer?: number
}

export type UpdateVehicleRequest = Partial<CreateVehicleRequest>

/* ── Maintenance ──────────────────────────────────────────────────────────── */
export type MaintenanceStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export interface Maintenance {
  id:           string
  vehicleId:    string
  type:         string
  date:         string
  km:           number
  price?:       number
  description?: string
  status:       MaintenanceStatus
  createdAt:    string
}

export interface CreateMaintenanceRequest {
  vehicleId:    string
  type:         string
  km:           number
  date:         string
  price?:       number
  description?: string
  status?:      MaintenanceStatus
}

/* ── Erro da API ──────────────────────────────────────────────────────────── */
export interface ApiErrorBody {
  message:    string | string[]
  error?:     string
  statusCode: number
}

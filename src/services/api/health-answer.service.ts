import { http } from './client'

export interface HealthAnswerPayload {
  type:   string
  answer: string
}

export interface HealthAnswer {
  id:            string
  vehicleId:     string
  type:          string
  answer:        string
  estimatedKm:   number | null
  estimatedDate: string | null
  createdAt:     string
  updatedAt:     string
}

export const healthAnswerService = {
  save(vehicleId: string, answers: HealthAnswerPayload[]): Promise<HealthAnswer[]> {
    return http.post(`/vehicles/${vehicleId}/health-answers`, { answers })
  },

  getAll(vehicleId: string): Promise<HealthAnswer[]> {
    return http.get(`/vehicles/${vehicleId}/health-answers`)
  },
}

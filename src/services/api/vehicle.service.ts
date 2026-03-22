import { http } from './client'
import type { CreateVehicleRequest, UpdateVehicleRequest, Vehicle } from '../../types/api.types'

export const vehicleService = {
  getAll(): Promise<Vehicle[]> {
    return http.get<Vehicle[]>('/vehicles')
  },

  getById(id: string): Promise<Vehicle> {
    return http.get<Vehicle>(`/vehicles/${id}`)
  },

  create(data: CreateVehicleRequest): Promise<Vehicle> {
    return http.post<Vehicle>('/vehicles', data)
  },

  update(id: string, data: UpdateVehicleRequest): Promise<Vehicle> {
    return http.patch<Vehicle>(`/vehicles/${id}`, data)
  },

  remove(id: string): Promise<void> {
    return http.delete<void>(`/vehicles/${id}`)
  },
}

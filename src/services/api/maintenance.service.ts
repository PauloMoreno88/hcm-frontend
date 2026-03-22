import { http } from './client'
import type { CreateMaintenanceRequest, Maintenance } from '../../types/api.types'

export const maintenanceService = {
  getByVehicle(vehicleId: string): Promise<Maintenance[]> {
    return http.get<Maintenance[]>(`/vehicles/${vehicleId}/maintenances`)
  },

  create(data: CreateMaintenanceRequest): Promise<Maintenance> {
    return http.post<Maintenance>('/maintenances', data)
  },

  update(id: string, data: Partial<CreateMaintenanceRequest>): Promise<Maintenance> {
    return http.patch<Maintenance>(`/maintenances/${id}`, data)
  },

  remove(id: string): Promise<void> {
    return http.delete<void>(`/maintenances/${id}`)
  },
}

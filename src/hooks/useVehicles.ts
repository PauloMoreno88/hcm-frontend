import { useCallback, useEffect, useState } from 'react'
import { vehicleService } from '../services/api'
import type { CreateVehicleRequest, UpdateVehicleRequest, Vehicle } from '../types/api.types'

interface UseVehiclesResult {
  vehicles:   Vehicle[]
  isLoading:  boolean
  isCreating: boolean
  isUpdating: boolean
  isRemoving: boolean
  error:      string | null
  create:     (data: CreateVehicleRequest) => Promise<Vehicle>
  update:     (id: string, data: UpdateVehicleRequest) => Promise<Vehicle>
  remove:     (id: string) => Promise<void>
  refetch:    () => void
}

export function useVehicles(): UseVehiclesResult {
  const [vehicles,   setVehicles]   = useState<Vehicle[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [error,      setError]      = useState<string | null>(null)
  const [tick,       setTick]       = useState(0)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    vehicleService.getAll()
      .then(data => { if (!cancelled) setVehicles(data) })
      .catch(err  => { if (!cancelled) setError(err.message ?? 'Erro ao carregar veículos') })
      .finally(()  => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [tick])

  const create = useCallback(async (data: CreateVehicleRequest): Promise<Vehicle> => {
    setIsCreating(true)
    setError(null)
    try {
      const created = await vehicleService.create(data)
      setVehicles(prev => [...prev, created])
      return created
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar veículo'
      setError(msg)
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [])

  const update = useCallback(async (id: string, data: UpdateVehicleRequest): Promise<Vehicle> => {
    setIsUpdating(true)
    setError(null)
    try {
      const updated = await vehicleService.update(id, data)
      setVehicles(prev => prev.map(v => v.id === id ? updated : v))
      return updated
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar veículo'
      setError(msg)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const remove = useCallback(async (id: string): Promise<void> => {
    setIsRemoving(true)
    setError(null)
    try {
      await vehicleService.remove(id)
      setVehicles(prev => prev.filter(v => v.id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir veículo'
      setError(msg)
      throw err
    } finally {
      setIsRemoving(false)
    }
  }, [])

  return {
    vehicles,
    isLoading,
    isCreating,
    isUpdating,
    isRemoving,
    error,
    create,
    update,
    remove,
    refetch: () => setTick(t => t + 1),
  }
}

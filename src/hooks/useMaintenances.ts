import { useCallback, useEffect, useState } from 'react'
import { maintenanceService } from '../services/api'
import type { CreateMaintenanceRequest, Maintenance, MaintenanceStatus } from '../types/api.types'

interface UseMaintenancesResult {
  maintenances:  Maintenance[]
  isLoading:     boolean
  isCreating:    boolean
  isRemoving:    boolean
  error:         string | null
  create:        (data: CreateMaintenanceRequest) => Promise<Maintenance>
  update:        (id: string, data: Partial<CreateMaintenanceRequest>) => Promise<Maintenance>
  updateStatus:  (id: string, status: MaintenanceStatus) => Promise<void>
  remove:        (id: string) => Promise<void>
  refetch:       () => void
}

export function useMaintenances(vehicleId: string | undefined): UseMaintenancesResult {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [isLoading,    setIsLoading]    = useState(true)
  const [isCreating,   setIsCreating]   = useState(false)
  const [isRemoving,   setIsRemoving]   = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [tick,         setTick]         = useState(0)

  useEffect(() => {
    if (!vehicleId) {
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)
    setError(null)

    maintenanceService.getByVehicle(vehicleId)
      .then(data => { if (!cancelled) setMaintenances(data) })
      .catch(err  => { if (!cancelled) setError(err.message ?? 'Erro ao carregar histórico') })
      .finally(()  => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [vehicleId, tick])

  const create = useCallback(async (data: CreateMaintenanceRequest): Promise<Maintenance> => {
    setIsCreating(true)
    setError(null)
    try {
      const created = await maintenanceService.create(data)
      setMaintenances(prev => [created, ...prev])
      return created
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar manutenção'
      setError(msg)
      throw err
    } finally {
      setIsCreating(false)
    }
  }, [])

  const update = useCallback(async (id: string, data: Partial<CreateMaintenanceRequest>): Promise<Maintenance> => {
    setError(null)
    try {
      const updated = await maintenanceService.update(id, data)
      setMaintenances(prev => prev.map(m => m.id === id ? updated : m))
      return updated
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar manutenção'
      setError(msg)
      throw err
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: MaintenanceStatus): Promise<void> => {
    let previous: Maintenance | undefined
    setMaintenances(prev => {
      previous = prev.find(m => m.id === id)
      return prev.map(m => m.id === id ? { ...m, status } : m)
    })
    try {
      await maintenanceService.update(id, { status })
      if (status === 'DONE') {
        setTick(t => t + 1)
      }
    } catch (err: unknown) {
      if (previous) {
        setMaintenances(prev => prev.map(m => m.id === id ? previous! : m))
      }
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar status'
      setError(msg)
    }
  }, [])

  const remove = useCallback(async (id: string): Promise<void> => {
    setIsRemoving(true)
    setError(null)
    try {
      await maintenanceService.remove(id)
      setMaintenances(prev => prev.filter(m => m.id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir manutenção'
      setError(msg)
      throw err
    } finally {
      setIsRemoving(false)
    }
  }, [])

  return {
    maintenances,
    isLoading,
    isCreating,
    isRemoving,
    error,
    create,
    update,
    updateStatus,
    remove,
    refetch: () => setTick(t => t + 1),
  }
}

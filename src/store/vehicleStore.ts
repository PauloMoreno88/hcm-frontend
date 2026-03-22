import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VehicleState {
  selectedVehicleId: string | null
  setSelectedVehicleId: (id: string) => void
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      selectedVehicleId: null,
      setSelectedVehicleId: (id) => set({ selectedVehicleId: id }),
    }),
    { name: 'hcm-selected-vehicle' },
  ),
)

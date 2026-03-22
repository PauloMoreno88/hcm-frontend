import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { VehicleForm, type VehicleFormData } from '../components/vehicles/VehicleForm'
import { useVehicles } from '../hooks/useVehicles'

export function EditVehiclePage() {
  const { id }      = useParams<{ id: string }>()
  const navigate    = useNavigate()
  const { vehicles, update, isUpdating } = useVehicles()
  const [formError, setFormError] = useState<string | null>(null)

  const vehicle = vehicles.find(v => v.id === id) ?? null

  const onSubmit = async (data: VehicleFormData) => {
    if (!id) return
    setFormError(null)
    try {
      await update(id, {
        brand:    data.brand.trim(),
        model:    data.model.trim(),
        year:     parseInt(data.year, 10),
        plate:    data.plate.trim() || undefined,
        nickname: data.nickname.trim() || `${data.brand.trim()} ${data.model.trim()}`,
        odometer: data.odometer ? parseInt(data.odometer, 10) : undefined,
      })
      navigate('/vehicles')
    } catch {
      setFormError('Erro ao salvar alterações. Tente novamente.')
    }
  }

  if (!vehicle) {
    return (
      <AppLayout>
        <div className="page-content">
          <header className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer"
              style={{ background: '#1a1a1a' }}
            >
              <BackIcon />
            </button>
            <h1 className="font-display font-bold text-2xl text-on-surface">Editar Veículo</h1>
          </header>
          <div className="card-hero flex items-center justify-center py-12">
            <p className="text-sm text-on-surface-variant">Veículo não encontrado.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  const defaultValues: Partial<VehicleFormData> = {
    brand:    vehicle.brand,
    model:    vehicle.model,
    year:     String(vehicle.year),
    plate:    vehicle.plate ?? '',
    nickname: vehicle.nickname,
    odometer: vehicle.odometer ? String(vehicle.odometer) : '',
  }

  return (
    <AppLayout hideBottomNav>
      <div className="page-content">

        <header className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors hover:bg-surface-highest cursor-pointer flex-shrink-0"
            style={{ background: '#1a1a1a' }}
            aria-label="Voltar"
          >
            <BackIcon />
          </button>
          <div>
            <h1 className="font-display font-bold text-2xl text-on-surface leading-tight">
              Editar Veículo
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {vehicle.nickname}
            </p>
          </div>
        </header>

        {formError && (
          <p className="text-sm text-center" style={{ color: '#ff716c' }}>{formError}</p>
        )}

        <VehicleForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={isUpdating}
          submitLabel="Salvar alterações"
          requireDirty
        />

      </div>
    </AppLayout>
  )
}

function BackIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }

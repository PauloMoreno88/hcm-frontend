import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { VehicleForm, type VehicleFormData } from '../components/vehicles/VehicleForm'
import { useVehicles } from '../hooks/useVehicles'

export function AddVehiclePage() {
  const navigate = useNavigate()
  const { create, isCreating } = useVehicles()
  const [formError, setFormError] = useState<string | null>(null)

  const onSubmit = async (data: VehicleFormData) => {
    setFormError(null)
    try {
      const created = await create({
        brand:    data.brand.trim(),
        model:    data.model.trim(),
        year:     parseInt(data.year, 10),
        plate:    data.plate.trim() || undefined,
        nickname: data.nickname.trim() || `${data.brand.trim()} ${data.model.trim()}`,
        odometer: data.odometer ? parseInt(data.odometer, 10) : 0,
      })
      navigate(`/health-setup?vehicleId=${created.id}`)
    } catch {
      setFormError('Erro ao cadastrar veículo. Tente novamente.')
    }
  }

  return (
    <AppLayout>
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
              Adicionar Veículo
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Preencha os dados do seu veículo
            </p>
          </div>
        </header>

        {formError && (
          <p className="text-sm text-center" style={{ color: '#ff716c' }}>{formError}</p>
        )}

        <VehicleForm
          onSubmit={onSubmit}
          isSubmitting={isCreating}
          submitLabel="Cadastrar Veículo"
        />

      </div>
    </AppLayout>
  )
}

function BackIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }

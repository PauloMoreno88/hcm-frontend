import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useVehicles } from '../hooks/useVehicles'
import { useMaintenances } from '../hooks/useMaintenances'
import { useVehicleStore } from '../store/vehicleStore'
import type { MaintenanceStatus } from '../types/api.types'

const STATUS_OPTIONS: { value: MaintenanceStatus; label: string; color: string; bg: string }[] = [
  { value: 'TODO',        label: 'A fazer', color: '#adaaaa', bg: 'rgba(173,170,170,0.12)' },
  { value: 'IN_PROGRESS', label: 'Fazendo', color: '#ffd460', bg: 'rgba(255,212,96,0.12)'  },
  { value: 'DONE',        label: 'Feito',   color: '#3fff8b', bg: 'rgba(63,255,139,0.10)'  },
]
const SERVICE_TYPES: { label: string; icon: React.ReactNode }[] = [
  { label: 'Troca de Óleo', icon: <OilIcon /> },
  { label: 'Freios',         icon: <BrakeIcon /> },
  { label: 'Pneus',          icon: <TireIcon /> },
  { label: 'Motor',          icon: <EngineIcon /> },
  { label: 'Transmissão',    icon: <TransmIcon /> },
  { label: 'Outros',         icon: <OtherIcon /> },
]

interface FormData {
  date:        string
  price:       string
  km:          string
  description: string
}

export function AddMaintenancePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isScheduleMode = searchParams.get('mode') === 'schedule'
  const today = new Date().toISOString().split('T')[0]

  const [selectedType,   setSelectedType]   = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<MaintenanceStatus>('DONE')
  const [photoPreview,   setPhotoPreview]   = useState<string | null>(null)
  const [formError,      setFormError]      = useState<string | null>(null)

  const { vehicles } = useVehicles()
  const { selectedVehicleId } = useVehicleStore()
  const vehicle = vehicles.find(v => v.id === selectedVehicleId) ?? vehicles[0] ?? null
  const { create, isCreating } = useMaintenances(vehicle?.id)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (!vehicle)      { setFormError('Nenhum veículo encontrado.'); return }
    if (!selectedType) { setFormError('Selecione o tipo de serviço.'); return }
    setFormError(null)

    try {
      await create({
        vehicleId:   vehicle.id,
        type:        selectedType,
        date:        data.date,
        km:          data.km ? parseInt(data.km, 10) : 0,
        price:       data.price ? parseFloat(data.price) : undefined,
        description: data.description || undefined,
        status:      selectedStatus,
      })
      navigate('/history')
    } catch {
      setFormError('Erro ao salvar. Tente novamente.')
    }
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setPhotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <AppLayout>
      <div className="page-content">

        {/* Header */}
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
              {isScheduleMode ? 'Agendar Manutenção' : 'Nova Manutenção'}
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isScheduleMode ? 'Agende o próximo serviço' : 'Registre o serviço realizado'}
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

          {/* Photo upload */}
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center justify-center rounded-[1.75rem] cursor-pointer transition-all overflow-hidden"
            style={{
              minHeight: 140,
              background: photoPreview ? 'transparent' : '#1a1a1a',
              border: photoPreview ? 'none' : '2px dashed rgba(72,72,71,0.35)',
            }}
          >
            {photoPreview ? (
              <div className="relative w-full group">
                <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-[1.75rem]" />
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.50)' }}
                >
                  <span className="text-sm font-medium text-white">Alterar foto</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(63,255,139,0.10)' }}
                >
                  <UploadIcon />
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Anexar recibo ou foto</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">PNG, JPG — até 10 MB</p>
                </div>
              </div>
            )}
            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>

          {/* Service type */}
          <div className="flex flex-col gap-2">
            <p className="section-label pl-1">Tipo de serviço</p>
            <div className="grid grid-cols-3 gap-2">
              {SERVICE_TYPES.map(({ label, icon }) => {
                const active = selectedType === label
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedType(label)}
                    className="flex flex-col items-center gap-2 py-4 px-2 rounded-[1.5rem] text-xs font-semibold transition-all duration-150 cursor-pointer"
                    style={active
                      ? { background: 'rgba(63,255,139,0.12)', color: '#3fff8b', boxShadow: '0 0 0 1.5px rgba(63,255,139,0.30)' }
                      : { background: '#1a1a1a', color: '#adaaaa' }
                    }
                  >
                    <span style={{ color: active ? '#3fff8b' : '#adaaaa' }}>{icon}</span>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <p className="section-label pl-1">Status</p>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedStatus(opt.value)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-2xl text-xs font-semibold transition-all duration-150 cursor-pointer"
                  style={selectedStatus === opt.value
                    ? { background: opt.bg, color: opt.color, boxShadow: `0 0 0 1.5px ${opt.color}40` }
                    : { background: '#1a1a1a', color: '#adaaaa' }
                  }
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedStatus === opt.value ? opt.color : '#adaaaa' }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Price */}
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data" type="date" icon={<CalIcon />} error={errors.date?.message}
              min={isScheduleMode ? (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0] })() : undefined}
              {...register('date', {
                required: 'Informe a data',
                validate: v => !isScheduleMode || v > today || 'A data deve ser futura',
              })} />
            <Input label="Valor (R$)" type="number" inputMode="decimal" placeholder="0,00"
              icon={<MoneyIcon />} error={errors.price?.message}
              {...register('price')} />
          </div>

          {/* Km */}
          <Input label="Quilometragem (km)" type="number" inputMode="numeric" placeholder="Ex: 42000"
            icon={<OdometerIcon />} error={errors.km?.message}
            {...register('km', { required: 'Informe a quilometragem' })} />

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <p className="section-label pl-1">Descrição</p>
            <textarea
              rows={3}
              placeholder="Detalhes do serviço realizado..."
              className="w-full px-5 py-4 rounded-[1.5rem] text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none resize-none"
              style={{ background: 'rgba(32,32,31,0.85)', caretColor: '#3fff8b' }}
              {...register('description')}
            />
          </div>

          {formError && (
            <p className="text-sm text-center" style={{ color: '#ff716c' }}>{formError}</p>
          )}

          <Button type="submit" fullWidth isLoading={isCreating}>
            <CheckIcon /> Salvar Registro
          </Button>

        </form>
      </div>
    </AppLayout>
  )
}

function BackIcon()     { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#adaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> }
function UploadIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3fff8b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> }
function CalIcon()      { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function MoneyIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
function OdometerIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="12"/></svg> }
// function LocationIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> }
function CheckIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function OilIcon()      { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v6l2 2-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6l-2-2 2-2V2"/><line x1="6" y1="12" x2="18" y2="12"/></svg> }
function BrakeIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> }
function TireIcon()     { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg> }
function EngineIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M6 8V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3"/><path d="M14 8V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3"/></svg> }
function TransmIcon()   { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="19" r="2"/><line x1="7" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="17" y2="12"/><line x1="12" y1="7" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="17"/></svg> }
function OtherIcon()    { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg> }

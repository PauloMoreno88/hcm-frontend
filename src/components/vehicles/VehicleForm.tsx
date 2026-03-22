import { useForm } from 'react-hook-form'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export interface VehicleFormData {
  brand:    string
  model:    string
  year:     string
  plate:    string
  nickname: string
  odometer: string
}

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormData>
  onSubmit:       (data: VehicleFormData) => Promise<void>
  isSubmitting:   boolean
  submitLabel:    string
  requireDirty?:  boolean
}

export function VehicleForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  requireDirty = false,
}: VehicleFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<VehicleFormData>({ mode: 'onChange', defaultValues })

  const brand = watch('brand', defaultValues?.brand ?? '')
  const model = watch('model', defaultValues?.model ?? '')

  const disabled = !isValid || (requireDirty && !isDirty)

  return (
    <div className="flex flex-col gap-5">

      {/* Preview card */}
      <div className="card-hero flex items-center gap-4" style={{ minHeight: 88 }}>
        <div
          className="w-14 h-14 rounded-[1.25rem] flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(63,255,139,0.10)' }}
        >
          <CarIllustration />
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-base text-on-surface truncate">
            {brand && model ? `${brand} ${model}` : 'Seu veículo'}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {watch('year') ? `Ano ${watch('year')}` : 'Preencha o formulário abaixo'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

        {/* Identificação */}
        <div className="flex flex-col gap-3">
          <p className="section-label pl-1">Identificação</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Marca"
              type="text"
              placeholder="Ex: Toyota"
              icon={<BrandIcon />}
              error={errors.brand?.message}
              {...register('brand', { required: 'Informe a marca' })}
            />
            <Input
              label="Modelo"
              type="text"
              placeholder="Ex: Corolla"
              icon={<ModelIcon />}
              error={errors.model?.message}
              {...register('model', { required: 'Informe o modelo' })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ano"
              type="number"
              inputMode="numeric"
              placeholder={String(new Date().getFullYear())}
              icon={<CalIcon />}
              error={errors.year?.message}
              {...register('year', {
                required: 'Informe o ano',
                min: { value: 1900, message: 'Ano inválido' },
                max: { value: new Date().getFullYear() + 1, message: 'Ano inválido' },
              })}
            />
            <Input
              label="Placa (opcional)"
              type="text"
              placeholder="ABC-1234"
              icon={<PlateIcon />}
              {...register('plate')}
            />
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="flex flex-col gap-3">
          <p className="section-label pl-1">Informações adicionais</p>
          <Input
            label="Apelido (opcional)"
            type="text"
            placeholder={brand && model ? `Ex: Meu ${model}` : 'Ex: Meu carro'}
            icon={<TagIcon />}
            {...register('nickname')}
          />
          <Input
            label="Odômetro atual (km)"
            type="number"
            inputMode="numeric"
            placeholder="Ex: 42000"
            icon={<OdometerIcon />}
            error={errors.odometer?.message}
            {...register('odometer', {
              min: { value: 0, message: 'Valor inválido' },
            })}
          />
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} disabled={disabled}>
          <CheckIcon /> {submitLabel}
        </Button>

      </form>
    </div>
  )
}

function BrandIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> }
function ModelIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></svg> }
function CalIcon()         { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }
function PlateIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><line x1="7" y1="12" x2="7.01" y2="12"/><line x1="12" y1="12" x2="17" y2="12"/></svg> }
function TagIcon()         { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> }
function OdometerIcon()    { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="12"/></svg> }
function CheckIcon()       { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> }
function CarIllustration() { return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3fff8b" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17H5v-3l2-6h10l2 6v3z"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/><path d="M5 17H3v-3l1-1"/><path d="M19 17h2v-3l-1-1"/></svg> }

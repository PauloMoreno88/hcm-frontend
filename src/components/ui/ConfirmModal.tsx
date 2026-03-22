import { useEffect } from 'react'
import { Button } from './Button'

interface ConfirmModalProps {
  open:           boolean
  title:          string
  description:    string
  confirmLabel?:  string
  isLoading?:     boolean
  onConfirm:      () => void
  onCancel:       () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  /* Bloqueia scroll do body enquanto aberto */
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else       document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      {/* Card */}
      <div
        className="w-full max-w-sm rounded-[2rem] p-6 flex flex-col gap-5"
        style={{
          background: '#1e1e1e',
          boxShadow: '0 24px 48px rgba(0,0,0,0.50)',
          border: '1px solid rgba(72,72,71,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-[1.1rem] flex items-center justify-center mx-auto"
          style={{ background: 'rgba(255,113,108,0.12)' }}
        >
          <TrashIcon />
        </div>

        {/* Text */}
        <div className="text-center flex flex-col gap-1.5">
          <h2 className="font-display font-bold text-lg text-on-surface">{title}</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">{description}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button variant="danger" fullWidth isLoading={isLoading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" fullWidth onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff716c"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

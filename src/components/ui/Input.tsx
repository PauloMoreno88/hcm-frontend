import { type InputHTMLAttributes, type ReactNode, forwardRef, useState } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:        string
  error?:        string
  icon?:         ReactNode
  rightElement?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 min-w-0">
        {label && (
          <label htmlFor={inputId} className="section-label pl-1">
            {label}
          </label>
        )}

        {/* Container — focus ring applied via CSS .input-wrapper:focus-within */}
        <div
          className="input-wrapper"
          style={error ? { boxShadow: '0 0 0 1.5px rgba(255,113,108,0.50)' } : undefined}
        >
          {icon && (
            <span className="text-on-surface-variant opacity-60 flex-shrink-0">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            style={{ caretColor: '#3fff8b' }}
            className={[
              'flex-1 min-w-0 bg-transparent text-sm font-medium text-on-surface',
              'placeholder:text-on-surface-variant/40',
              'focus:outline-none',
              className,
            ].join(' ')}
            {...props}
          />

          {rightElement && (
            <span className="text-on-surface-variant opacity-60 flex-shrink-0">
              {rightElement}
            </span>
          )}
        </div>

        {error && (
          <p className="text-xs text-error pl-1">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

/* ── Password variant ─────────────────────────────────────────────────── */
interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightElement'> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        rightElement={
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            className="cursor-pointer focus:outline-none"
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        }
        {...props}
      />
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

function EyeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
function EyeOffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

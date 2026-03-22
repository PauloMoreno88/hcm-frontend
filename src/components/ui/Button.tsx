import { type ButtonHTMLAttributes, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost' | 'danger'
type ButtonSize    = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?:   ButtonVariant
  size?:      ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

const SIZE: Record<ButtonSize, string> = {
  md: 'h-12 px-6 text-sm',   /* 48px — default CTA */
  sm: 'h-9  px-4 text-xs',   /* 36px — compact actions */
}

const VARIANT_STYLE: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)',
    color: '#005d2c',
    boxShadow: '0 0 20px rgba(63,255,139,0.22)',
  },
  ghost: {
    background: 'rgba(44,44,44,0.50)',
    border: '1px solid rgba(72,72,71,0.22)',
    color: '#ffffff',
  },
  danger: {
    background: 'rgba(255,113,108,0.10)',
    border: '1px solid rgba(255,113,108,0.22)',
    color: '#ff716c',
  },
}

export function Button({
  children,
  variant   = 'primary',
  size      = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const isDisabled = isLoading || disabled

  return (
    <button
      disabled={isDisabled}
      style={{
        ...VARIANT_STYLE[variant],
        opacity: isDisabled ? 0.55 : 1,
        cursor:  isDisabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-full font-semibold',
        'transition-all duration-150 active:scale-[0.97]',
        'focus-visible:outline-none',
        SIZE[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : children}
    </button>
  )
}

import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'
import { Input, PasswordInput } from '../ui/Input'
import { GoogleButton } from './GoogleButton'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password)
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) navigate('/dashboard')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Erro global */}
      {error && (
        <div className="flex items-center gap-2 bg-error-container/40 border border-error/30 rounded-2xl px-4 py-3">
          <AlertIcon />
          <p className="text-error text-sm">{error}</p>
          <button onClick={clearError} className="ml-auto text-error/60 hover:text-error cursor-pointer">
            <CloseIcon />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          icon={<EmailIcon />}
          error={errors.email?.message}
          {...register('email', {
            required: 'E-mail é obrigatório',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'E-mail inválido',
            },
          })}
        />

        <PasswordInput
          label="Senha"
          placeholder="••••••••"
          icon={<LockIcon />}
          error={errors.password?.message}
          {...register('password', {
            required: 'Senha é obrigatória',
            minLength: {
              value: 6,
              message: 'Mínimo de 6 caracteres',
            },
          })}
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Entrar
        </Button>
      </form>

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-outline-variant/30" />
        <span className="text-xs text-on-surface-variant">ou</span>
        <div className="flex-1 h-px bg-outline-variant/30" />
      </div>

      {/* Google */}
      <GoogleButton onClick={loginWithGoogle} isLoading={isLoading} />

      {/* Criar conta */}
      <p className="text-center text-sm text-on-surface-variant">
        Não tem conta?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-primary font-semibold hover:brightness-110 transition-all cursor-pointer"
        >
          Criar conta
        </button>
      </p>
    </div>
  )
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error flex-shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

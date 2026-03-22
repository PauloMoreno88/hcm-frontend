import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'
import { Input, PasswordInput } from '../ui/Input'

interface RegisterFormData {
  name:            string
  email:           string
  password:        string
  confirmPassword: string
}

export function RegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data.name, data.email, data.password)
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) navigate('/dashboard')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Erro global da API */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: 'rgba(255,113,108,0.10)', border: '1px solid rgba(255,113,108,0.25)' }}>
          <AlertIcon />
          <p className="text-sm flex-1" style={{ color: '#ff716c' }}>{error}</p>
          <button onClick={clearError} className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity" style={{ color: '#ff716c' }}>
            <CloseIcon />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <Input
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          icon={<UserIcon />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Nome é obrigatório',
            minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
          })}
        />

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
          placeholder="Mínimo 6 caracteres"
          icon={<LockIcon />}
          error={errors.password?.message}
          {...register('password', {
            required: 'Senha é obrigatória',
            minLength: { value: 6, message: 'Mínimo de 6 caracteres' },
          })}
        />

        <PasswordInput
          label="Confirmar senha"
          placeholder="Repita a senha"
          icon={<LockIcon />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Confirmação é obrigatória',
            validate: v => v === password || 'As senhas não coincidem',
          })}
        />

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          Criar conta
        </Button>
      </form>

      {/* Divisor */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-outline-variant/30" />
        <span className="text-xs text-on-surface-variant">ou</span>
        <div className="flex-1 h-px bg-outline-variant/30" />
      </div>

      {/* Voltar para login */}
      <p className="text-center text-sm text-on-surface-variant">
        Já tem uma conta?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-primary font-semibold hover:brightness-110 transition-all cursor-pointer"
        >
          Entrar
        </button>
      </p>

    </div>
  )
}

function UserIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}

function EmailIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
}

function LockIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}

function AlertIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff716c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
}

function CloseIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}

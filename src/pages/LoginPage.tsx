import { LoginForm } from '../components/auth/LoginForm'

const HERO_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDibe_GgiGgUCOLYW9eRkgnzdJjYu2_jlfJg0rFta-JYeaUUmHzo8uuDcI3MDNJCGvWpZCQ64vIr73RC-tSL8TeFWu5yF4mdLcSyxBF5fd2nbCO69H9sRAapW7zIH4IIc09b9A0sQy-tj49ePt4keX39Xv1-RFtCSSRQvD_bWqPl3cGsgyAja4X3JPwUEZnmqls-nELypw4yA6zq93nV21hFKqZLLffF1Dbe44f15cPbu1KpSGyIDifoawIwNBOrYUXU2NbrBqm4g0b'

export function LoginPage() {
  return (
    <div className="relative min-h-screen bg-surface overflow-hidden">

      {/* ── Hero: imagem do carro ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${HERO_IMAGE_URL}')` }}
        aria-hidden="true"
      />

      {/* ── Gradiente: transparente no topo → #0e0e0e sólido na base ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(14,14,14,0.15) 0%, rgba(14,14,14,0.55) 40%, rgba(14,14,14,1) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Glow ambiental verde (canto superior esq) ── */}
      <div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(63,255,139,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Layout principal ── */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

        {/* ─── Coluna esquerda: hero text ─── */}
        <div className="flex-1 flex flex-col justify-end lg:justify-center px-8 pt-10 pb-6 lg:px-16 lg:pb-16">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 lg:mb-14">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_16px_rgba(63,255,139,0.35)]">
              <CarIcon />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-on-surface">
              HCM
            </span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 w-fit mb-5"
            style={{ background: 'rgba(63,255,139,0.10)' }}>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Precision Garage
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl lg:text-[3.5rem] leading-tight text-on-surface mb-4 max-w-lg">
            Alta Performance{' '}
            <span
              className="block"
              style={{
                background: 'linear-gradient(90deg, #3fff8b 0%, #13ea79 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              na ponta dos dedos.
            </span>
          </h1>

          <p className="text-on-surface-variant text-base lg:text-lg max-w-md leading-relaxed">
            Gerencie o histórico de manutenções do seu veículo com a precisão que ele merece.
          </p>
        </div>

        {/* ─── Coluna direita: card de login ─── */}
        <div className="flex items-center justify-center px-6 py-10 lg:px-16 lg:min-w-[500px]">
          <div
            className="w-full max-w-[440px] rounded-[2rem] p-8 lg:p-10"
            style={{
              background: 'rgba(44,44,44,0.60)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.40)',
              border: '1px solid rgba(72,72,71,0.15)',
            }}
          >
            {/* Header do card */}
            <div className="mb-8">
              <h2 className="font-display font-bold text-2xl text-on-surface mb-1.5">
                Bem-vindo de volta
              </h2>
              <p className="text-on-surface-variant text-sm">
                Entre na sua conta para continuar
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-5 left-0 right-0 text-center text-xs text-on-surface/20 z-10">
        © 2026 HCM Precision Garage
      </p>
    </div>
  )
}

function CarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#005d2c"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17H5v-3l2-6h10l2 6v3z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
      <path d="M5 17H3v-3l1-1" />
      <path d="M19 17h2v-3l-1-1" />
    </svg>
  )
}

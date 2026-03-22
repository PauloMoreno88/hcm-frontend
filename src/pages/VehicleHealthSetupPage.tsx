import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { healthAnswerService } from '../services/api'

/* ── Types ───────────────────────────────────────────────────────────────── */
type Answer = 'recent' | 'while' | 'over_year' | 'never' | 'no_timing_belt'

interface QuestionConfig {
  apiType:      string
  label:        string
  icon:         () => JSX.Element
  extraOptions?: { value: Answer; label: string; sublabel: string }[]
}

/* ── Question config ─────────────────────────────────────────────────────── */
const QUESTIONS: QuestionConfig[] = [
  { apiType: 'engine_oil',      label: 'Troca de Óleo',           icon: OilIcon         },
  { apiType: 'brakes',          label: 'Freios',                   icon: BrakeIcon       },
  { apiType: 'tires',           label: 'Pneus',                    icon: TireIcon        },
  {
    apiType: 'timing_belt',
    label:   'Correia Dentada',
    icon:    TimingBeltIcon,
    extraOptions: [
      { value: 'no_timing_belt', label: 'Meu carro não tem correia dentada', sublabel: 'Motor com corrente ou sem correia' },
    ],
  },
  { apiType: 'cooling_system',  label: 'Sistema de Arrefecimento', icon: CoolantIcon     },
]

const ANSWER_OPTIONS: { value: Answer; label: string; sublabel: string }[] = [
  { value: 'recent',    label: 'Fiz recentemente',  sublabel: 'Nos últimos 3 meses'   },
  { value: 'while',     label: 'Faz um tempo',       sublabel: 'Entre 3 e 12 meses'   },
  { value: 'over_year', label: 'Mais de 1 ano',      sublabel: 'Há mais de 12 meses'  },
  { value: 'never',     label: 'Nunca fiz',          sublabel: 'Pelo menos que eu saiba' },
]

/* ── Page ────────────────────────────────────────────────────────────────── */
// Steps: 0 = intro | 1..3 = questions | 4 = saving
const TOTAL_STEPS = QUESTIONS.length

export function VehicleHealthSetupPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const vehicleId      = searchParams.get('vehicleId') ?? ''

  const [step,    setStep]    = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const questionIndex = step - 1                                        // step 1 → question 0
  const currentQ      = QUESTIONS[questionIndex] ?? null
  const progress      = step === 0 ? 0 : Math.round((step / TOTAL_STEPS) * 100)

  /* ── Navigation ────────────────────────────────────────────────────────── */
  function next() { setStep(s => s + 1) }

  function selectAnswer(answer: Answer) {
    const updated = { ...answers, [currentQ.apiType]: answer }
    setAnswers(updated)
    if (questionIndex < QUESTIONS.length - 1) {
      next()
    } else {
      handleSave(updated)
    }
  }

  /* ── Save ──────────────────────────────────────────────────────────────── */
  async function handleSave(finalAnswers: Record<string, Answer>) {
    setStep(TOTAL_STEPS + 1)
    setSaving(true)
    setError(null)

    const payload = QUESTIONS.map(q => ({
      type:   q.apiType,
      answer: finalAnswers[q.apiType],
    }))

    try {
      await healthAnswerService.save(vehicleId, payload)
      navigate('/dashboard')
    } catch {
      setError('Erro ao salvar. Tente novamente.')
      setSaving(false)
      setStep(TOTAL_STEPS) // volta para a última pergunta
    }
  }

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0e0e0e' }}>

      {/* Progress bar */}
      {step > 0 && step <= TOTAL_STEPS && (
        <div className="w-full h-1" style={{ background: '#1a1a1a' }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #3fff8b, #13ea79)' }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">

        {/* ── Step 0: Intro ─────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="flex flex-col items-center gap-8 text-center w-full">
            <div
              className="w-20 h-20 rounded-[1.75rem] flex items-center justify-center"
              style={{ background: 'rgba(63,255,139,0.10)' }}
            >
              <HeartPulseIcon />
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-display font-bold text-3xl text-on-surface leading-tight">
                Vamos analisar a saúde do seu carro
              </h1>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Responda algumas perguntas rápidas sobre as últimas manutenções.<br />
                Leva menos de 1 minuto.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={next}
                className="h-14 rounded-[1.5rem] text-base font-bold cursor-pointer transition-transform active:scale-95"
                style={{ background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)', color: '#005d2c' }}
              >
                Começar análise
              </button>
              {/* <button
                onClick={() => navigate('/dashboard')}
                className="h-10 text-sm text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors"
              >
                Pular por agora
              </button> */}
            </div>
          </div>
        )}

        {/* ── Steps 1–N: Questions ──────────────────────────────────────── */}
        {step >= 1 && step <= TOTAL_STEPS && currentQ && (
          <div className="flex flex-col gap-7 w-full">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#3fff8b' }}>
                Passo {step} de {TOTAL_STEPS}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(63,255,139,0.10)' }}
                >
                  <span style={{ color: '#3fff8b' }}><currentQ.icon /></span>
                </div>
                <h2 className="font-display font-bold text-2xl text-on-surface leading-tight">
                  {currentQ.label}
                </h2>
              </div>
              <p className="text-sm text-on-surface-variant pl-1">
                Quando foi a última vez que fez isso?
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {ANSWER_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(opt.value)}
                  className="flex items-center justify-between px-5 h-16 rounded-[1.5rem] text-left cursor-pointer transition-all duration-150 active:scale-[0.98]"
                  style={{ background: '#1a1a1a' }}
                >
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{opt.label}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{opt.sublabel}</p>
                  </div>
                  <ChevronIcon />
                </button>
              ))}
              {currentQ.extraOptions?.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(opt.value)}
                  className="flex items-center justify-between px-5 h-16 rounded-[1.5rem] text-left cursor-pointer transition-all duration-150 active:scale-[0.98]"
                  style={{ background: '#1a1a1a', borderTop: '1px solid #2a2a2a' }}
                >
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{opt.label}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{opt.sublabel}</p>
                  </div>
                  <ChevronIcon />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step saving ───────────────────────────────────────────────── */}
        {step === TOTAL_STEPS + 1 && (
          <div className="flex flex-col items-center gap-6 text-center">
            {saving ? (
              <>
                <div
                  className="w-16 h-16 rounded-full border-4 animate-spin"
                  style={{ borderColor: '#1a1a1a', borderTopColor: '#3fff8b' }}
                />
                <div>
                  <p className="font-display font-bold text-xl text-on-surface">Calculando saúde...</p>
                  <p className="text-sm text-on-surface-variant mt-1">Salvando suas respostas</p>
                </div>
              </>
            ) : error ? (
              <>
                <p className="text-sm" style={{ color: '#ff716c' }}>{error}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="h-12 px-8 rounded-full text-sm font-bold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #3fff8b 0%, #13ea79 100%)', color: '#005d2c' }}
                >
                  Ir para o dashboard
                </button>
              </>
            ) : null}
          </div>
        )}

      </div>
    </div>
  )
}

/* ── Icons ───────────────────────────────────────────────────────────────── */
function HeartPulseIcon() {
  return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3fff8b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
}
function OilIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v6l2 2-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6l-2-2 2-2V2"/><line x1="6" y1="12" x2="18" y2="12"/></svg>
}
function BrakeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
}
function TireIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
}
function TimingBeltIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="4" height="10" rx="1"/><rect x="18" y="7" width="4" height="10" rx="1"/><line x1="6" y1="9" x2="18" y2="9"/><line x1="6" y1="15" x2="18" y2="15"/><path d="M6 9 Q4 12 6 15"/><path d="M18 9 Q20 12 18 15"/></svg>
}
function CoolantIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/><path d="M22 12h-4"/><circle cx="12" cy="12" r="3"/></svg>
}
function ChevronIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#484847" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
}

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: checked ? '#3fff8b' : 'rgba(72,72,71,0.40)' }}
    >
      <span
        className="inline-block w-5 h-5 rounded-full shadow transition-transform duration-200"
        style={{
          background:  checked ? '#005d2c' : '#adaaaa',
          transform:   checked ? 'translateX(22px)' : 'translateX(2px)',
        }}
      />
    </button>
  )
}

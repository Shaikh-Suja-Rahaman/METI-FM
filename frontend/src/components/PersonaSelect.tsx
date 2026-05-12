import React, { useEffect, useRef, useState } from 'react'

type Option = {
  value: string
  label: string
  color: string // CSS var or hex
}

type PersonaSelectProps = {
  value: string
  onChange: (value: string) => void
}

const options: Option[] = [
  { value: 'chillFriend',    label: 'Chill Friend',     color: 'var(--a-sky)'   },
  { value: 'gentleListener', label: 'Gentle Listener',  color: 'var(--a-mint)'  },
  { value: 'harshCoach',     label: 'Harsh Coach',      color: 'var(--a-coral)' },
]

const PersonaSelect = ({ value, onChange }: PersonaSelectProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value) || options[0]

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (optValue: string) => {
    onChange(optValue)
    setOpen(false)
  }

  return (
    <div className="neo-dropdown" ref={ref}>
      <button
        type="button"
        className={`neo-dropdown-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="neo-dropdown-dot"
            style={{ background: selected.color }}
          />
          {selected.label}
        </span>
        <span className="neo-dropdown-arrow">▼</span>
      </button>

      {open && (
        <div className="neo-dropdown-menu" role="listbox">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              className={`neo-dropdown-option${opt.value === value ? ' selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              <span
                className="neo-dropdown-dot"
                style={{ background: opt.color }}
              />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default PersonaSelect

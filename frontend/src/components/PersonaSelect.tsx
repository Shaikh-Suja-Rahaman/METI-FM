import { useEffect, useRef, useState } from "react"
import type { PointerEvent } from "react"

type Option = {
  value: string
  label: string
  colorClass: string
}

type PersonaSelectProps = {
  value: string
  onChange: (value: string) => void
}

const options: Option[] = [
  { value: "chillFriend", label: "Chill Friend", colorClass: "bg-vibeSky" },
  { value: "gentleListener", label: "Gentle Listener", colorClass: "bg-vibeMint" },
  { value: "harshCoach", label: "Harsh Coach", colorClass: "bg-vibeCoral" },
]

const PersonaSelect = ({ value, onChange }: PersonaSelectProps) => {
  const containerSize = 180
  const dialSize = 120
  const containerRadius = containerSize / 2
  const dialRadius = dialSize / 2
  const tickRadius = containerRadius - 18
  const markerRadius = containerRadius - 2
  const indicatorLength = dialRadius - 18

  const [isPressed, setIsPressed] = useState(false)
  const valueRef = useRef(value)
  const dragStateRef = useRef({ pointerId: null as number | null, lastX: 0, accumulated: 0 })

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const activeIndex = Math.max(0, options.findIndex((opt) => opt.value === value))
  const activeColorClass = options[activeIndex]?.colorClass || "bg-vibeSky"

  const markerAngles = options.length === 1
    ? [0]
    : options.map((_, idx) => -120 + (240 / (options.length - 1)) * idx)

  const tickAngles = Array.from({ length: 11 }, (_, i) => -130 + i * 26)
  const tickHeights = [3, 5, 7, 9, 11, 13, 11, 9, 7, 5, 3]

  const stepPersona = (steps: number) => {
    const currentIndex = Math.max(0, options.findIndex((opt) => opt.value === valueRef.current))
    const nextIndex = (currentIndex + steps + options.length) % options.length
    if (options[nextIndex]) {
      onChange(options[nextIndex].value)
    }
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStateRef.current.pointerId = event.pointerId
    dragStateRef.current.lastX = event.clientX
    dragStateRef.current.accumulated = 0
    setIsPressed(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isPressed || dragStateRef.current.pointerId !== event.pointerId) return
    const deltaX = event.clientX - dragStateRef.current.lastX
    dragStateRef.current.lastX = event.clientX
    dragStateRef.current.accumulated += deltaX

    const threshold = 24
    const steps = Math.trunc(dragStateRef.current.accumulated / threshold)
    if (steps !== 0) {
      dragStateRef.current.accumulated -= steps * threshold
      stepPersona(steps)
    }
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragStateRef.current.pointerId = null
    dragStateRef.current.accumulated = 0
    setIsPressed(false)
  }

  const dialTransform = isPressed
    ? "translate(-50%, -50%) translate(8px, 8px)"
    : "translate(-50%, -50%)"

  return (
    <div className="w-full">
      <div className="neo-border bg-vibeLavender shadow-neo-sm rounded-xl p-3 flex items-center justify-center">
        <div
          className="relative overflow-visible select-none"
          style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
        >
          {tickAngles.map((angle, index) => (
            <div
              key={`tick-${angle}-${index}`}
              className="absolute left-1/2 top-1/2 bg-border"
              style={{
                width: "5px",
                height: `${tickHeights[index]}px`,
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${tickRadius}px)`
              }}
            />
          ))}

          {options.map((opt, index) => {
            const angle = markerAngles[index]
            const isActive = index === activeIndex
            return (
              <div
                key={opt.value}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${markerRadius}px)` }}
              >
                <button
                  type="button"
                  onClick={() => onChange(opt.value)}
                  className="flex items-center gap-2"
                  style={{ transform: `rotate(${-angle}deg)` }}
                >
                  <span
                    className={`block h-[10px] w-[18px] border-2 border-border bg-border transition-transform duration-200 ease-out ${isActive ? "scale-125" : ""}`}
                  />
                  <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-widest bg-background border-2 border-border">
                    {opt.label}
                  </span>
                </button>
              </div>
            )
          })}

          <div
            className={`absolute left-1/2 top-1/2 rounded-full border-[4px] border-border ${activeColorClass} ${isPressed ? "shadow-none" : "shadow-[8px_8px_0px_0px_hsl(var(--border))]"} transition-[box-shadow,transform] duration-150 ease-in-out ${isPressed ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ width: `${dialSize}px`, height: `${dialSize}px`, transform: dialTransform, touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              className="absolute left-1/2 top-1/2 w-[7px] bg-border origin-bottom transition-transform duration-200 ease-out"
              style={{ height: `${indicatorLength}px`, transform: `translate(-50%, -100%) rotate(${markerAngles[activeIndex] ?? 0}deg)` }}
            />
            <div className="absolute left-1/2 top-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonaSelect

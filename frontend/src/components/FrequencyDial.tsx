import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ENTITIES, FREQ_MIN, FREQ_MAX, WARNING_MHZ } from '../entities';

type FrequencyDialProps = {
  frequency: number;
  onChange: (freq: number) => void;
  revealedEntities: Set<string>;
  locked?: boolean;
};

const ARC_MIN = -150;
const ARC_MAX =  150;
const ARC_TOTAL = ARC_MAX - ARC_MIN;

const KNOB_R   = 52;
const RING_R   = 80;
const CENTER   = 108;
const SVG_SIZE = CENTER * 2;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const freqToAngle = (mhz: number) => ARC_MIN + ((mhz - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * ARC_TOTAL;
const angleToFreq = (deg: number) => FREQ_MIN + ((deg - ARC_MIN) / ARC_TOTAL) * (FREQ_MAX - FREQ_MIN);
const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

const FrequencyDial: React.FC<FrequencyDialProps> = ({ frequency, onChange, revealedEntities, locked = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ lastAngle: 0, pointerId: null as number | null });
  const svgRef  = useRef<SVGSVGElement>(null);

  // When AIRA locks the dial, kill any in-flight drag immediately
  useEffect(() => {
    if (locked) {
      dragRef.current.pointerId = null;
      setIsDragging(false);
    }
  }, [locked]);

  const currentAngle = freqToAngle(clamp(frequency, FREQ_MIN, FREQ_MAX));

  const pointerAngle = useCallback((cx: number, cy: number) => {
    if (!svgRef.current) return 0;
    const r = svgRef.current.getBoundingClientRect();
    return (Math.atan2(cy - (r.top + r.height / 2), cx - (r.left + r.width / 2)) * 180) / Math.PI + 90;
  }, []);

  const onPointerDown = (e: React.PointerEvent<SVGGElement>) => {
    if (locked) return; // AIRA modal is open — freeze the dial
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
    dragRef.current = { lastAngle: pointerAngle(e.clientX, e.clientY), pointerId: e.pointerId };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (locked || !isDragging || dragRef.current.pointerId !== e.pointerId) return;
    const na = pointerAngle(e.clientX, e.clientY);
    let delta = na - dragRef.current.lastAngle;
    if (delta >  180) delta -= 360;
    if (delta < -180) delta += 360;
    dragRef.current.lastAngle = na;
    const next = clamp(angleToFreq(clamp(currentAngle + delta, ARC_MIN, ARC_MAX)), FREQ_MIN, FREQ_MAX);
    onChange(Math.round(next * 10) / 10);
  };

  const onPointerUp = (e: React.PointerEvent<SVGGElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    (e.currentTarget as SVGGElement).releasePointerCapture(e.pointerId);
    dragRef.current.pointerId = null;
    setIsDragging(false);
  };

  // Fixed indicator endpoint
  const indRad = toRad(currentAngle);
  const indX   = CENTER + Math.cos(indRad) * (KNOB_R - 12);
  const indY   = CENTER + Math.sin(indRad) * (KNOB_R - 12);

  // Static neo shadow — no press-down effect
  const KX = 0, KY = 0, SX = 3, SY = 3;

  const warnRad      = toRad(freqToAngle(WARNING_MHZ));
  const warnLabelX   = CENTER + Math.cos(warnRad) * (RING_R + 22);
  const warnLabelY   = CENTER + Math.sin(warnRad) * (RING_R + 22);

  return (
    <div className="w-full flex flex-col items-center gap-1">
      {/* No tabIndex — prevents browser focus ring entirely */}
      <svg
        ref={svgRef}
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="overflow-visible select-none"
        style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
      >
        {/* Dashed ring track */}
        <circle cx={CENTER} cy={CENTER} r={RING_R} fill="none"
          stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />

        {/* Active arc */}
        {(() => {
          const sa = toRad(ARC_MIN), ea = toRad(currentAngle);
          const la = ea - sa > Math.PI ? 1 : 0;
          const x1 = CENTER + RING_R * Math.cos(sa), y1 = CENTER + RING_R * Math.sin(sa);
          const x2 = CENTER + RING_R * Math.cos(ea), y2 = CENTER + RING_R * Math.sin(ea);
          return (
            <path d={`M ${x1} ${y1} A ${RING_R} ${RING_R} 0 ${la} 1 ${x2} ${y2}`}
              fill="none"
              stroke={frequency >= WARNING_MHZ ? 'hsl(var(--pip))' : 'hsl(var(--vorrk))'}
              strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          );
        })()}

        {/* Tick marks */}
        {Array.from({ length: 17 }, (_, i) => {
          const ang = ARC_MIN + (ARC_TOTAL / 16) * i, rad = toRad(ang), major = i % 4 === 0;
          return (
            <line key={i}
              x1={CENTER + Math.cos(rad) * (RING_R - (major ? 7 : 4))}
              y1={CENTER + Math.sin(rad) * (RING_R - (major ? 7 : 4))}
              x2={CENTER + Math.cos(rad) * (RING_R + (major ? 1 : 0))}
              y2={CENTER + Math.sin(rad) * (RING_R + (major ? 1 : 0))}
              stroke="hsl(var(--border))" strokeWidth={major ? 1.5 : 0.8} opacity={0.35} />
          );
        })}

        {/* Warning marker */}
        <line
          x1={CENTER + Math.cos(warnRad) * (RING_R - 10)} y1={CENTER + Math.sin(warnRad) * (RING_R - 10)}
          x2={CENTER + Math.cos(warnRad) * (RING_R + 10)} y2={CENTER + Math.sin(warnRad) * (RING_R + 10)}
          stroke="#ef4444" strokeWidth="2" opacity="0.9" />
        <text x={warnLabelX} y={warnLabelY} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#ef4444" fontWeight="bold">⚠</text>

        {/* Entity markers — all at their true mhz positions (no visual remapping needed) */}
        {ENTITIES.map((entity) => {
          const isRevealed = entity.revealedByDefault || revealedEntities.has(entity.id);
          const angle  = freqToAngle(entity.mhz);
          const rad    = toRad(angle);
          const dotX   = CENTER + Math.cos(rad) * (RING_R - 3);
          const dotY   = CENTER + Math.sin(rad) * (RING_R - 3);
          const labelX = CENTER + Math.cos(rad) * (RING_R + 22);
          const labelY = CENTER + Math.sin(rad) * (RING_R + 22);

          // angle > 0 = right half, angle < 0 = left half, near zero = top
          const anchor = angle > 20 ? 'start' : angle < -20 ? 'end' : 'middle';

          const dotColor  = isRevealed ? (entity.dotColor || entity.hexColor) : '#4a4a4a';
          const textColor = isRevealed ? (entity.dotColor || entity.hexColor) : '#555';

          return (
            <g key={entity.id} style={{ cursor: 'pointer' }} onClick={() => onChange(entity.mhz)}>
              {!isRevealed && (
                <circle cx={dotX} cy={dotY} r={6}
                  fill="none" stroke="#444" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
              )}
              <circle cx={dotX} cy={dotY} r={isRevealed ? 4.5 : 3}
                fill={dotColor} stroke="hsl(var(--border))" strokeWidth="1.5"
                opacity={isRevealed ? 0.95 : 0.5} />
              <text x={labelX} y={labelY - 5} textAnchor={anchor}
                fontSize="6.5" fontWeight="bold" fontFamily="Space Mono, monospace"
                fill={textColor} opacity={isRevealed ? 0.9 : 0.5}
                style={!isRevealed ? { fontStyle: 'italic' } : {}}>
                {isRevealed ? entity.name : '???'}
              </text>
              <text x={labelX} y={labelY + 5} textAnchor={anchor}
                fontSize="5.5" fontFamily="Space Mono, monospace"
                fill="hsl(var(--foreground))" opacity={isRevealed ? 0.5 : 0.3}>
                {isRevealed ? entity.displayFreq : '_ _ _ Hz'}
              </text>
            </g>
          );
        })}

        {/* Draggable knob */}
        <g
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}    onPointerCancel={onPointerUp}
          style={{ cursor: locked ? 'not-allowed' : isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        >
          {/* Static neo shadow */}
          <circle cx={CENTER + SX} cy={CENTER + SY} r={KNOB_R} fill="hsl(var(--border))" opacity="0.85" />
          {/* Knob body — never offsets on press */}
          <circle cx={CENTER + KX} cy={CENTER + KY} r={KNOB_R}
            fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="3" />
          {/* Inner ring */}
          <circle cx={CENTER + KX} cy={CENTER + KY} r={KNOB_R - 9}
            fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.25" />
          {/* Indicator */}
          <line x1={CENTER + KX} y1={CENTER + KY} x2={indX + KX} y2={indY + KY}
            stroke="hsl(var(--border))" strokeWidth="3" strokeLinecap="round" />
          <circle cx={CENTER + KX} cy={CENTER + KY} r={4} fill="hsl(var(--border))" />
        </g>
      </svg>

      <p className="text-[9px] font-mono text-center opacity-30 uppercase tracking-widest">
        drag · click marker to snap
      </p>
    </div>
  );
};

export default FrequencyDial;

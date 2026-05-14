import React, { useRef, useState, useCallback } from 'react';
import { ENTITIES, FREQ_MIN, FREQ_MAX, WARNING_MHZ } from '../entities';

type FrequencyDialProps = {
  frequency: number;
  onChange: (freq: number) => void;
  revealedEntities: Set<string>;
};

const ARC_MIN = -150;
const ARC_MAX =  150;
const ARC_TOTAL = ARC_MAX - ARC_MIN;

// Dial geometry — intentionally smaller to avoid overflow & save sidebar space
const KNOB_R   = 52;   // knob radius
const RING_R   = 80;   // marker ring radius
const CENTER   = 108;  // SVG centre (half of SVG_SIZE)
const SVG_SIZE = CENTER * 2;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const freqToAngle = (mhz: number) =>
  ARC_MIN + ((mhz - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * ARC_TOTAL;

const angleToFreq = (deg: number) =>
  FREQ_MIN + ((deg - ARC_MIN) / ARC_TOTAL) * (FREQ_MAX - FREQ_MIN);

const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;

// Dark entities are naturally clustered in a ~30° arc at the bottom-left.
// We spread their VISUAL positions evenly across the restricted zone for readability.
// Clicking still snaps to their real MHz.
const DARK_VISUAL_ANGLES: Record<string, number> = {
  theSignal: -148,
  vorrk:     -133,
  theHusk:   -118,
  theHorde:  -103,
};

const getMarkerAngle = (entityId: string, mhz: number) =>
  DARK_VISUAL_ANGLES[entityId] ?? freqToAngle(mhz);

const FrequencyDial: React.FC<FrequencyDialProps> = ({ frequency, onChange, revealedEntities }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ lastAngle: 0, pointerId: null as number | null });
  const svgRef  = useRef<SVGSVGElement>(null);

  const currentAngle = freqToAngle(clamp(frequency, FREQ_MIN, FREQ_MAX));

  const pointerAngle = useCallback((cx: number, cy: number) => {
    if (!svgRef.current) return 0;
    const r = svgRef.current.getBoundingClientRect();
    const dx = cx - (r.left + r.width  / 2);
    const dy = cy - (r.top  + r.height / 2);
    return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  }, []);

  const onPointerDown = (e: React.PointerEvent<SVGElement>) => {
    e.preventDefault();
    (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
    dragRef.current = { lastAngle: pointerAngle(e.clientX, e.clientY), pointerId: e.pointerId };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<SVGElement>) => {
    if (!isDragging || dragRef.current.pointerId !== e.pointerId) return;
    const na = pointerAngle(e.clientX, e.clientY);
    let delta = na - dragRef.current.lastAngle;
    if (delta >  180) delta -= 360;
    if (delta < -180) delta += 360;
    dragRef.current.lastAngle = na;
    const nextAngle = clamp(currentAngle + delta, ARC_MIN, ARC_MAX);
    onChange(Math.round(clamp(angleToFreq(nextAngle), FREQ_MIN, FREQ_MAX) * 10) / 10);
  };

  const onPointerUp = (e: React.PointerEvent<SVGElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) return;
    (e.currentTarget as SVGElement).releasePointerCapture(e.pointerId);
    dragRef.current.pointerId = null;
    setIsDragging(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')
      onChange(clamp(Math.round((frequency + step) * 10) / 10, FREQ_MIN, FREQ_MAX));
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown')
      onChange(clamp(Math.round((frequency - step) * 10) / 10, FREQ_MIN, FREQ_MAX));
  };

  // Knob indicator endpoint
  const indRad = toRad(currentAngle);
  const indX   = CENTER + Math.cos(indRad) * (KNOB_R - 12);
  const indY   = CENTER + Math.sin(indRad) * (KNOB_R - 12);

  // Neobrutalist press: knob drops 3px when dragging (shadow shifts to 1px)
  const knobOffsetX = isDragging ? 3 : 0;
  const knobOffsetY = isDragging ? 3 : 0;
  const shadowX     = isDragging ? 1 : 4;
  const shadowY     = isDragging ? 1 : 4;

  // Warning marker
  const warnAngle = freqToAngle(WARNING_MHZ);
  const warnRad   = toRad(warnAngle);
  const warnLineInX  = CENTER + Math.cos(warnRad) * (RING_R - 10);
  const warnLineInY  = CENTER + Math.sin(warnRad) * (RING_R - 10);
  const warnLineOutX = CENTER + Math.cos(warnRad) * (RING_R + 10);
  const warnLineOutY = CENTER + Math.sin(warnRad) * (RING_R + 10);
  const warnLabelX   = CENTER + Math.cos(warnRad) * (RING_R + 22);
  const warnLabelY   = CENTER + Math.sin(warnRad) * (RING_R + 22);

  return (
    <div className="w-full flex flex-col items-center gap-1">
      <svg
        ref={svgRef}
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="overflow-visible select-none"
        tabIndex={0}
        onKeyDown={onKeyDown}
        style={{ outline: 'none' }}
      >
        {/* ── Dashed ring track ── */}
        <circle cx={CENTER} cy={CENTER} r={RING_R} fill="none"
          stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />

        {/* ── Active arc (safe=green accent, dark=red accent) ── */}
        {(() => {
          const r = RING_R;
          const sa = toRad(ARC_MIN);
          const ea = toRad(currentAngle);
          const la = ea - sa > Math.PI ? 1 : 0;
          const x1 = CENTER + r * Math.cos(sa); const y1 = CENTER + r * Math.sin(sa);
          const x2 = CENTER + r * Math.cos(ea); const y2 = CENTER + r * Math.sin(ea);
          return (
            <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${la} 1 ${x2} ${y2}`}
              fill="none"
              stroke={frequency >= WARNING_MHZ ? 'hsl(var(--pip))' : 'hsl(var(--vorrk))'}
              strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          );
        })()}

        {/* ── Tick marks (compact, 17 ticks) ── */}
        {Array.from({ length: 17 }, (_, i) => {
          const ang   = ARC_MIN + (ARC_TOTAL / 16) * i;
          const rad   = toRad(ang);
          const major = i % 4 === 0;
          const ir    = RING_R - (major ? 7 : 4);
          const or    = RING_R + (major ? 1 : 0);
          return (
            <line key={i}
              x1={CENTER + Math.cos(rad) * ir} y1={CENTER + Math.sin(rad) * ir}
              x2={CENTER + Math.cos(rad) * or} y2={CENTER + Math.sin(rad) * or}
              stroke="hsl(var(--border))" strokeWidth={major ? 1.5 : 0.8} opacity={0.35} />
          );
        })}

        {/* ── WARNING marker ── */}
        <line x1={warnLineInX} y1={warnLineInY} x2={warnLineOutX} y2={warnLineOutY}
          stroke="#f59e0b" strokeWidth="2" opacity="0.9" />
        <text x={warnLabelX} y={warnLabelY} textAnchor="middle" dominantBaseline="middle"
          fontSize="9" fill="#f59e0b" fontWeight="bold">⚠</text>

        {/* ── Entity markers ── */}
        {ENTITIES.map((entity) => {
          const isRevealed = entity.revealedByDefault || revealedEntities.has(entity.id);
          const markerAngle = getMarkerAngle(entity.id, entity.mhz);
          const rad     = toRad(markerAngle);
          const dotX    = CENTER + Math.cos(rad) * (RING_R - 3);
          const dotY    = CENTER + Math.sin(rad) * (RING_R - 3);
          const labelX  = CENTER + Math.cos(rad) * (RING_R + 21);
          const labelY  = CENTER + Math.sin(rad) * (RING_R + 21);

          const normAngle = ((markerAngle % 360) + 360) % 360;
          const anchor = normAngle > 180 && normAngle < 360
            ? (normAngle > 270 ? 'start' : 'end')
            : (normAngle < 90 ? 'start' : normAngle > 90 && normAngle < 180 ? 'end' : 'middle');

          const dotColor  = isRevealed
            ? (entity.side === 'light' ? entity.hexColor : (entity.dotColor || entity.hexColor))
            : '#4a4a4a';
          const dotR      = isRevealed ? 4.5 : 3;
          const textColor = isRevealed
            ? (entity.side === 'light' ? entity.hexColor : (entity.dotColor || '#999'))
            : '#555';

          return (
            <g key={entity.id} style={{ cursor: 'pointer' }} onClick={() => onChange(entity.mhz)}>
              {/* Glitch ring for unrevealed */}
              {!isRevealed && (
                <circle cx={dotX} cy={dotY} r={dotR + 2}
                  fill="none" stroke="#444" strokeWidth="0.5" opacity="0.4"
                  strokeDasharray="2 2" />
              )}
              <circle cx={dotX} cy={dotY} r={dotR}
                fill={dotColor} stroke="hsl(var(--border))" strokeWidth="1.5"
                opacity={isRevealed ? 0.95 : 0.5} />

              {/* Name label */}
              <text x={labelX} y={labelY - 5} textAnchor={anchor}
                fontSize="7" fontWeight="bold" fontFamily="Space Mono, monospace"
                fill={textColor} opacity={isRevealed ? 0.9 : 0.5}
                style={!isRevealed ? { fontStyle: 'italic' } : {}}>
                {isRevealed ? `${entity.name}${entity.dangerIcon ? ` ${entity.dangerIcon}` : ''}` : '???'}
              </text>

              {/* MHz label */}
              <text x={labelX} y={labelY + 5} textAnchor={anchor}
                fontSize="6" fontFamily="Space Mono, monospace"
                fill="hsl(var(--foreground))" opacity={isRevealed ? 0.55 : 0.3}>
                {isRevealed ? `${entity.mhz} MHz` : '_ _ _._ MHz'}
              </text>
            </g>
          );
        })}

        {/* ── Draggable knob ── */}
        <g
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}    onPointerCancel={onPointerUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        >
          {/* Neobrutalist shadow — shifts on press */}
          <circle
            cx={CENTER + shadowX} cy={CENTER + shadowY} r={KNOB_R}
            fill="hsl(var(--border))" opacity="0.85"
          />
          {/* Knob body */}
          <circle
            cx={CENTER + knobOffsetX} cy={CENTER + knobOffsetY} r={KNOB_R}
            fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="3"
            style={{ transition: isDragging ? 'none' : 'cx 0.08s,cy 0.08s' }}
          />
          {/* Inner ring detail */}
          <circle
            cx={CENTER + knobOffsetX} cy={CENTER + knobOffsetY} r={KNOB_R - 9}
            fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.25"
          />
          {/* Indicator line */}
          <line
            x1={CENTER + knobOffsetX} y1={CENTER + knobOffsetY}
            x2={indX + knobOffsetX}  y2={indY + knobOffsetY}
            stroke="hsl(var(--border))" strokeWidth="3" strokeLinecap="round"
          />
          {/* Centre dot */}
          <circle cx={CENTER + knobOffsetX} cy={CENTER + knobOffsetY} r={4}
            fill="hsl(var(--border))" />
        </g>
      </svg>

      <p className="text-[9px] font-mono text-center opacity-30 uppercase tracking-widest">
        drag to tune · click marker to snap
      </p>
    </div>
  );
};

export default FrequencyDial;

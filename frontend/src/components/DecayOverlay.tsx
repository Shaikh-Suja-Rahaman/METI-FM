import React from 'react';

type DecayOverlayProps = {
  frequencyLevel: number; // 0 = 0.1MHz (max decay), 1 = 900MHz (safe)
  frequency: number;
};

const DecayOverlay: React.FC<DecayOverlayProps> = ({ frequencyLevel, frequency }) => {
  // decay starts at 200MHz (level ~0.22), maxes at 0.1MHz (level 0)
  const decayAmount = Math.max(0, 1 - frequencyLevel / 0.222);
  const crackOpacity = Math.min(1, Math.max(0, (decayAmount - 0.1) * 1.8));
  const vineSize = Math.min(220, Math.max(0, (decayAmount - 0.15) * 300));
  const fullCrackOpacity = Math.min(1, Math.max(0, (1 - frequencyLevel / 0.06) * 1.5));

  if (frequencyLevel > 0.24) return null; // above ~215MHz, no overlay

  return (
    <div className="fixed inset-0 pointer-events-none z-40" aria-hidden="true">
      {/* ── Corner vines (bottom-left) ── */}
      {vineSize > 0 && (
        <svg
          className="absolute bottom-0 left-0"
          width={vineSize + 40}
          height={vineSize + 40}
          viewBox="0 0 260 260"
          style={{ opacity: Math.min(1, crackOpacity * 1.2) }}
        >
          <g fill="none" stroke="#1a2a1a" strokeWidth="2.5" strokeLinecap="round">
            <path d="M0,260 C20,200 10,150 50,120 C80,95 40,60 80,40" opacity="0.7"/>
            <path d="M0,260 C40,220 60,190 30,160 C10,140 50,100 40,70" opacity="0.5"/>
            <path d="M0,260 C10,240 30,220 20,200 C15,185 45,170 35,150 C25,135 55,110 50,90" opacity="0.4"/>
            <path d="M50,260 C60,230 45,200 70,180 C90,165 70,130 100,110" opacity="0.45"/>
            <path d="M0,240 C15,230 25,215 15,200" opacity="0.35"/>
            {/* Leaf-like side branches */}
            <path d="M35,180 C45,165 60,170 55,180" opacity="0.3" strokeWidth="1.5"/>
            <path d="M55,140 C65,130 75,140 65,148" opacity="0.3" strokeWidth="1.5"/>
          </g>
        </svg>
      )}

      {/* ── Corner vines (bottom-right) ── */}
      {vineSize > 0 && (
        <svg
          className="absolute bottom-0 right-0"
          width={vineSize + 40}
          height={vineSize + 40}
          viewBox="0 0 260 260"
          style={{ opacity: Math.min(1, crackOpacity * 1.1), transform: 'scaleX(-1)' }}
        >
          <g fill="none" stroke="#1a2a1a" strokeWidth="2.5" strokeLinecap="round">
            <path d="M0,260 C20,200 10,150 50,120 C80,95 40,60 80,40" opacity="0.6"/>
            <path d="M0,260 C40,220 60,190 30,160 C10,140 50,100 40,70" opacity="0.45"/>
            <path d="M50,260 C60,230 45,200 70,180 C90,165 70,130 100,110" opacity="0.4"/>
            <path d="M35,180 C45,165 60,170 55,180" opacity="0.25" strokeWidth="1.5"/>
          </g>
        </svg>
      )}

      {/* ── Corner cracks (top-left) ── */}
      {crackOpacity > 0.15 && (
        <svg
          className="absolute top-0 left-0"
          width="200"
          height="180"
          viewBox="0 0 200 180"
          style={{ opacity: crackOpacity * 0.65 }}
        >
          <g stroke="#0a0a0a" strokeWidth="1" fill="none" strokeLinecap="round">
            <path d="M0,0 L40,30 L25,55 L70,80 L45,105 L90,130" opacity="0.5"/>
            <path d="M0,20 L30,40 L20,70 L55,85" opacity="0.35"/>
            <path d="M10,0 L35,25 L15,50" opacity="0.3"/>
            <path d="M40,30 L60,20 L85,35" opacity="0.25" strokeWidth="0.7"/>
          </g>
        </svg>
      )}

      {/* ── Corner cracks (top-right) ── */}
      {crackOpacity > 0.15 && (
        <svg
          className="absolute top-0 right-0"
          width="200"
          height="180"
          viewBox="0 0 200 180"
          style={{ opacity: crackOpacity * 0.55, transform: 'scaleX(-1)' }}
        >
          <g stroke="#0a0a0a" strokeWidth="1" fill="none" strokeLinecap="round">
            <path d="M0,0 L40,30 L25,55 L70,80 L45,105" opacity="0.45"/>
            <path d="M0,20 L30,40 L20,70 L55,85" opacity="0.3"/>
            <path d="M10,0 L35,25 L15,50" opacity="0.25"/>
          </g>
        </svg>
      )}

      {/* ── Full-screen heavy crack (very low frequency) ── */}
      {fullCrackOpacity > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: fullCrackOpacity * 0.5 }}
        >
          <defs>
            <filter id="crackBlur">
              <feGaussianBlur stdDeviation="0.3"/>
            </filter>
          </defs>
          <g stroke="#050505" strokeWidth="1.2" fill="none" strokeLinecap="round" filter="url(#crackBlur)">
            <path d="M10%,5% L25%,20% L18%,35% L40%,50% L28%,65% L50%,80% L35%,95%" vectorEffect="non-scaling-stroke" opacity="0.5"/>
            <path d="M85%,0% L70%,15% L80%,30% L60%,45% L75%,65% L55%,80%" vectorEffect="non-scaling-stroke" opacity="0.45"/>
            <path d="M0%,40% L15%,50% L8%,65% L30%,75%" vectorEffect="non-scaling-stroke" opacity="0.35"/>
            <path d="M90%,40% L75%,52% L88%,68% L65%,78%" vectorEffect="non-scaling-stroke" opacity="0.35"/>
            <path d="M40%,2% L50%,25% L45%,40%" vectorEffect="non-scaling-stroke" opacity="0.3"/>
            <path d="M25%,20% L35%,28% L30%,35%" vectorEffect="non-scaling-stroke" opacity="0.2" strokeWidth="0.7"/>
          </g>
        </svg>
      )}

      {/* ── Scan line effect (extreme decay) ── */}
      {frequency <= 10 && (
        <div
          className="absolute left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.04), transparent)',
            animation: 'meti-scan-line 4s linear infinite',
            top: 0,
          }}
        />
      )}
    </div>
  );
};

export default DecayOverlay;

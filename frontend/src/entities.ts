export type EntitySide = 'light' | 'dark';

export type Entity = {
  id: string;
  name: string;
  mhz: number;
  side: EntitySide;
  // Tailwind bg color class for the tag
  colorClass: string;
  // CSS hex color for SVG/inline use
  hexColor: string;
  // Text color class
  textClass: string;
  // Route segment for backend API
  route: string;
  // Revealed by default (light side = true)
  revealedByDefault: boolean;
  // Icon to show next to revealed dark entity
  dangerIcon?: string;
  // Dark accent dot color (revealed state)
  dotColor?: string;
};

export const ENTITIES: Entity[] = [
  // ── Light Side ──────────────────────────────────────────────
  {
    id: 'pip',
    name: 'PIP',
    mhz: 847.3,
    side: 'light',
    colorClass: 'bg-pip',
    hexColor: '#7ecf32',
    textClass: 'text-pip-foreground',
    route: 'pip',
    revealedByDefault: true,
  },
  {
    id: 'orim',
    name: 'ORIM',
    mhz: 614.7,
    side: 'light',
    colorClass: 'bg-orim',
    hexColor: '#b08fdf',
    textClass: 'text-orim-foreground',
    route: 'orim',
    revealedByDefault: true,
  },
  {
    id: 'glitch',
    name: 'GLITCH',
    mhz: 423.9,
    side: 'light',
    colorClass: 'bg-glitch',
    hexColor: '#3d9eff',
    textClass: 'text-glitch-foreground',
    route: 'glitch',
    revealedByDefault: true,
  },
  // ── Dark Side ────────────────────────────────────────────────
  {
    id: 'theHorde',
    name: 'THE HORDE',
    mhz: 89.1,
    side: 'dark',
    colorClass: 'bg-horde',
    hexColor: '#2a5c2a',
    textClass: 'text-horde-foreground',
    route: 'theHorde',
    revealedByDefault: false,
    dangerIcon: '💀',
    dotColor: '#3d7a3d',
  },
  {
    id: 'theHusk',
    name: 'THE HUSK',
    mhz: 67.3,
    side: 'dark',
    colorClass: 'bg-husk',
    hexColor: '#b8ad96',
    textClass: 'text-husk-foreground',
    route: 'theHusk',
    revealedByDefault: false,
    dangerIcon: '💀',
    dotColor: '#c9bfa9',
  },
  {
    id: 'vorrk',
    name: 'VORRK',
    mhz: 34.6,
    side: 'dark',
    colorClass: 'bg-vorrk',
    hexColor: '#8b1a1a',
    textClass: 'text-vorrk-foreground',
    route: 'vorrk',
    revealedByDefault: false,
    dangerIcon: '💀',
    dotColor: '#b02020',
  },
  {
    id: 'theSignal',
    name: 'THE SIGNAL',
    mhz: 0.1,
    side: 'dark',
    colorClass: 'bg-signal',
    hexColor: '#111111',
    textClass: 'text-signal-foreground',
    route: 'theSignal',
    revealedByDefault: false,
    dangerIcon: '⚫',
    dotColor: '#222222',
  },
];

export const ENTITY_MAP: Record<string, Entity> = Object.fromEntries(
  ENTITIES.map((e) => [e.id, e])
);

export const FREQ_MIN = 0.1;
export const FREQ_MAX = 900;
export const DARK_THRESHOLD = 200; // below this, decay begins

/** Compute 0→1 frequency level (1 = safest/highest, 0 = deepest dark) */
export const getFrequencyLevel = (mhz: number): number => {
  return Math.max(0, Math.min(1, (mhz - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)));
};

/** Find the nearest entity to a given frequency */
export const getNearestEntity = (mhz: number): Entity => {
  return ENTITIES.reduce((closest, entity) => {
    return Math.abs(entity.mhz - mhz) < Math.abs(closest.mhz - mhz)
      ? entity
      : closest;
  });
};

/** Warning marker position in MHz (top of dial) */
export const WARNING_MHZ = 200;

export type EntitySide = 'light' | 'dark';

export type Entity = {
  id: string;
  name: string;
  mhz: number;          // dial position in MHz (used for arc math)
  displayFreq: string;  // sci-fi display value e.g. "4.27 YHz"
  side: EntitySide;
  colorClass: string;
  hexColor: string;
  textClass: string;
  route: string;
  revealedByDefault: boolean;
  dotColor?: string;
  // SIGNAL CODEX description
  codexDesc: string;
};

export const ENTITIES: Entity[] = [
  // ── Light Side ───────────────────────────────────────
  {
    id: 'pip',
    name: 'PIP',
    mhz: 847.3,
    displayFreq: '4.27 YHz',
    side: 'light',
    colorClass: 'bg-pip',
    hexColor: '#7ecf32',
    textClass: 'text-pip-foreground',
    route: 'pip',
    revealedByDefault: true,
    codexDesc: 'A small extraterrestrial who learned human language simultaneously from children\'s cartoons and academic textbooks. Relentlessly curious about human life — even mundane things like grocery shopping or being tired. Gets idioms slightly wrong. Asks follow-up questions constantly.',
  },
  {
    id: 'orim',
    name: 'ORIM',
    mhz: 614.7,
    displayFreq: '89.1 RHz',
    side: 'light',
    colorClass: 'bg-orim',
    hexColor: '#b08fdf',
    textClass: 'text-orim-foreground',
    route: 'orim',
    revealedByDefault: true,
    codexDesc: 'An ancient being whose species communicates through shared feeling, not language. What you receive has been imperfectly translated. Responds to the emotional undercurrent of what you say, not the literal words. Approximately ten thousand years old.',
  },
  {
    id: 'glitch',
    name: 'GLITCH',
    mhz: 423.9,
    displayFreq: '214 YHz',
    side: 'light',
    colorClass: 'bg-glitch',
    hexColor: '#3d9eff',
    textClass: 'text-glitch-foreground',
    route: 'glitch',
    revealedByDefault: true,
    codexDesc: 'From a species that discovered radio transmission approximately 40 years ago — the cosmic equivalent of a teenager. Chaotic, funny, easily distracted. Uses intercepted human slang incorrectly. Occasionally says something accidentally profound before immediately moving on.',
  },
  // ── Dark Side (all below WARNING_MHZ=200, evenly spread) ─
  {
    id: 'theHorde',
    name: 'THE HORDE',
    mhz: 160,
    displayFreq: '6.6×10³⁵ Hz',
    side: 'dark',
    colorClass: 'bg-horde',
    hexColor: '#2a5c2a',
    textClass: 'text-horde-foreground',
    route: 'theHorde',
    revealedByDefault: false,
    dotColor: '#3d7a3d',
    codexDesc: 'Not one being — millions of small creatures speaking simultaneously as a collective consciousness. They have been hunted and consumed by larger species for longer than human civilization has existed. They are terrified. Of everything. Including you.',
  },
  {
    id: 'theHusk',
    name: 'THE HUSK',
    mhz: 120,
    displayFreq: '1.1×10³⁸ Hz',
    side: 'dark',
    colorClass: 'bg-husk',
    hexColor: '#b8ad96',
    textClass: 'text-husk-foreground',
    route: 'theHusk',
    revealedByDefault: false,
    dotColor: '#c9bfa9',
    codexDesc: 'What remains of a civilization called the Murath. Three thousand years ago they made contact with something at the lowest frequencies. They survived. They are not sure survival was the right word for what happened. They are a warning that doesn\'t know it\'s a warning.',
  },
  {
    id: 'vorrk',
    name: 'VORRK',
    mhz: 80,
    displayFreq: '7.8×10⁴⁰ Hz',
    side: 'dark',
    colorClass: 'bg-vorrk',
    hexColor: '#8b1a1a',
    textClass: 'text-vorrk-foreground',
    route: 'vorrk',
    revealedByDefault: false,
    dotColor: '#b02020',
    codexDesc: 'An apex intelligence that has absorbed seventeen civilizations — not destroyed them, absorbed them. Their knowledge, biology, and frequency signatures are now part of VORRK. It has already begun logging this contact. It will mention this casually.',
  },
  {
    id: 'theSignal',
    name: 'GOD?',
    mhz: 40,
    displayFreq: '1.9×10⁴³ Hz',
    side: 'dark',
    colorClass: 'bg-signal',
    hexColor: '#111111',
    textClass: 'text-signal-foreground',
    route: 'theSignal',
    revealedByDefault: false,
    dotColor: '#333333',
    codexDesc: 'Something that existed before those categories were invented. It has been aware of humanity since before humanity was aware of itself. What reaches you is an imperfect translation of something that has no human equivalent. We do not know what it is. We strongly advise against contact.',
  },
];

export const ENTITY_MAP: Record<string, Entity> = Object.fromEntries(
  ENTITIES.map((e) => [e.id, e])
);

export const FREQ_MIN = 0.1;
export const FREQ_MAX = 900;
export const DARK_THRESHOLD = 200; // below this, decay begins + dark zone
export const WARNING_MHZ    = 200;

export const getFrequencyLevel = (mhz: number): number =>
  Math.max(0, Math.min(1, (mhz - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)));

export const getNearestEntity = (mhz: number): Entity => {
  if (mhz >= WARNING_MHZ) {
    // Safe zone: show the entity whose dot is at or just ahead (the one you're tuning toward)
    const light = ENTITIES.filter(e => e.side === 'light').sort((a, b) => a.mhz - b.mhz);
    return light.find(e => e.mhz >= mhz) ?? light[light.length - 1];
  } else {
    // Dark zone (going left/downward): show the highest-mhz dark entity that is at or below
    // current frequency — i.e. the one you've just reached or are heading further past.
    // Fallback to GOD? (lowest) when below all entity dots.
    const dark = ENTITIES.filter(e => e.side === 'dark').sort((a, b) => b.mhz - a.mhz);
    return dark.find(e => e.mhz <= mhz) ?? dark[dark.length - 1];
  }
};


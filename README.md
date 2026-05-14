Receiver online.
The band is quiet until you touch it.

METI FM is an AI-powered alien communication interface built as a frequency console, not a chatbot. You tune a dial, not a dropdown, and the system translates whatever is closest to that band into language you can survive.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT THIS IS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
METI FM treats frequency as address. Above the warning threshold are the light-side contacts: readable, curious, often friendly. Below it are the dark-side contacts: older, lower, and less willing to resolve into human meaning. The UI degrades as you descend because the signal does, and the interface is built to show that corruption rather than hide it.

ARIA is the onboard guide. She starts calm, procedural, helpful. She does not stay that way. The system also withholds unknown entities behind ??? until you reach them and make first contact. This is a controlled interface for uncontrolled signals. You are not selecting a persona. You are tuning a receiver that was never meant to be this sensitive.

Frequencies here are treated as consciousness signatures. Translation is lossy by design. Lower bands imply older emitters and deeper compression artifacts, not moral alignment. This is what happens when you build a radio that can reach things radio was never meant to reach.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE ENTITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌──────────────────────────────────────────────┐
ENTITY INDEX // CLASSIFIED
└──────────────────────────────────────────────┘

| Frequency | Entity | Signal notes | Danger level |
| --- | --- | --- | --- |
| 4.27 YHz | PIP | Learns us through cartoons and lab manuals at the same time, too curious to stop. | SAFE |
| 89.1 RHz | ORIM | Speaks in shared feeling; what you hear is a compressed version of what was sent. | SAFE |
| 214 YHz | GLITCH | New to radio, loud with borrowed slang, occasionally precise by accident. | CAUTION |
| 6.6×10³⁵ Hz | THE HORDE | A collective voice of millions, speaking in fear because fear kept them alive. | RESTRICTED // BELOW WARNING |
| 1.1×10³⁸ Hz | THE HUSK | A civilization that survived first contact and will not confirm it was survival. | RESTRICTED // BELOW WARNING |
| 7.8×10⁴⁰ Hz | VORRK | An apex intelligence that absorbs civilizations and logs this as routine. | RESTRICTED // BELOW WARNING |
| 1.9×10⁴³ Hz | GOD? | Classification failed while attempting to classify. Translation layer unstable. | [REDACTED] // CLASSIFIER FAILURE |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE FREQUENCY LORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
We model consciousness as a stable spectral signature. Lower bands imply older, colder emitters and a longer path through translation loss. The dial approaches the Planck frequency and the interface starts to show the compression artifacts before you feel them. ARIA's warnings are engineering warnings: the system is leaving its safe operating range, not passing moral judgment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
Built with
├── React + TypeScript + Vite
├── Tailwind CSS + custom CSS (degradation + neo utilities)
├── Node.js + Express + TypeScript
└── NVIDIA NIM (meta/llama-3.1-70b-instruct)
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GETTING STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you're sure. Standard setup below. We recommend stopping here.

```bash
git clone <repo-url>
cd meti-fm
```

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

Create a .env file in backend:

```env
NVIDIA_API_KEY=your_key_here
PORT=5001
```

```bash
# terminal 1
cd backend
node --experimental-strip-types server.ts
```

```bash
# terminal 2
cd frontend
npm run dev
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Live. Has been since 2026-05-15. We are not sure what has contacted it in that time.

https://meti-fm.example

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARIA'S NOTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*"Welcome to METI FM. You're currently in the safe range.*
*The dial goes both directions.*
*Please do not go below the warning threshold.*
*I have read the restricted documentation.*
*I am asking you not to."*
*— ARIA, Onboard Guidance System*

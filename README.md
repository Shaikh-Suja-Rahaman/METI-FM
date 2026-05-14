# METI FM

Receiver warmed.
Signal lock is stable.
Some bands should not be decoded.

METI FM is an AI-powered alien communication interface. Inspired by METI/SETI research, radio engineering, and speculative linguistics, it treats contact as a tuning problem rather than a conversation. The core interaction is a frequency dial: higher bands resolve into clearer, cooperative signals, while lower bands become older, distorted, and harder to translate. This is why it feels different from a normal AI chat interface: you are not choosing a persona, you are moving across a spectrum and letting the system tell you what is there.

## What This Is

METI FM is a speculative engineering system that maps fictional consciousness signatures to an AI translation layer. The interface presents a continuous dial instead of discrete selections, because the underlying model assumes intelligence exists on a spectrum. Above the warning threshold, contacts are stable and interpretable. Below it, the signal becomes ancient, compressed, and often hostile to clear meaning.

As frequencies decrease, the UI degrades to reflect signal quality, not mood. Translation instability increases because the model is forced to reconcile increasingly nonhuman patterns with human language. ARIA, the onboard guide AI, monitors system integrity and becomes more concerned as the user descends. Unknown entities remain hidden until first contact, at which point they are indexed and exposed to the interface. The lowest bands are treated as older consciousness signatures, not as moral categories.

## Entities

| Frequency | Name | Description | Danger Level |
| --- | --- | --- | --- |
| 4.27 x 10^24 Hz | PIP | Learns through borrowed human media and refuses to stop asking why. | SAFE |
| 8.91 x 10^28 Hz | ORIM | Communicates via emotional resonance; language is an approximation. | SAFE |
| 2.14 x 10^26 Hz | GLITCH | Early-stage broadcaster; noisy, fast, occasionally precise by accident. | CAUTION |
| 6.6 x 10^35 Hz | THE HORDE | A collective voice shaped by survival and perpetual loss. | RESTRICTED |
| 1.1 x 10^38 Hz | THE HUSK | Residual transmission from a civilization that never fully recovered. | RESTRICTED |
| 7.8 x 10^40 Hz | VORRK | An assimilating intelligence that logs contact as routine telemetry. | RESTRICTED |
| 1.9 x 10^43 Hz | THE SIGNAL / GOD? | Classification fails; translation layer cannot stabilize. | [DATA CORRUPTED] |

## Frequency Theory

We model consciousness as a persistent spectral signature. Lower frequencies correlate with older, more entropic emitters and a longer path through translation loss. Approaching the Planck-frequency boundary introduces compression artifacts the interface cannot fully correct. ARIA's warnings are engineering concerns about signal stability, not moral judgment.

## Tech Stack

Built with

- React
- TypeScript
- Vite
- Tailwind CSS + custom CSS
- Node.js + Express
- NVIDIA NIM (OpenAI-compatible API)

## Getting Started

If you're sure.

```bash
git clone https://github.com/Shaikh-Suja-Rahaman/METI-FM
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

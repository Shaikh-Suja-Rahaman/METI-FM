# METI FM 📡

Receiver warmed.
Signal lock is stable.
Some bands should not be decoded.

METI FM is an AI-powered alien communication interface. Inspired by METI/SETI research, radio engineering, and speculative linguistics, it treats contact as a tuning problem rather than a conversation. The core mechanic is a frequency dial: higher bands resolve into clearer, cooperative signals, while lower bands become older, distorted, and harder to translate. This is why it feels different from a normal AI chat interface: you are not choosing a persona, you are moving across a spectrum and letting the system report what is there.

**Live Demo:** Not published yet.

<p align="center">
	<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
	<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
	<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
	<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
	<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
	<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
	<img src="https://img.shields.io/badge/NVIDIA_NIM-76B900?style=for-the-badge&logo=nvidia&logoColor=white" alt="NVIDIA NIM" />
</p>

## What This Is

METI FM is a speculative engineering system that maps fictional consciousness signatures to an AI translation layer. The interface presents a continuous dial instead of discrete selections, because the underlying model assumes intelligence exists on a spectrum. Above the warning threshold, contacts are stable and interpretable. Below it, the signal becomes ancient, compressed, and increasingly difficult to reconcile with human language.

As frequencies decrease, the UI degrades to reflect signal quality, not mood. Translation instability increases because the model is forced to align nonhuman patterns with human syntax. ARIA, the onboard guide AI, monitors system integrity and becomes more concerned as the user descends. Unknown entities remain hidden until first contact, at which point they are indexed and exposed to the interface. The lowest bands are treated as older consciousness signatures, not as moral categories.

<details>
<summary>How METI FM Works</summary>


A brief technical orientation before you begin.

### What you're tuning

Every conscious mind, regardless of biology, origin, or physical form, generates electromagnetic activity. Your own brain produces it right now. Neurons firing. Patterns forming. That activity has a frequency signature unique to your species.

METI FM does not send messages. It does not translate language. It tunes to the resonant cognitive frequency of other conscious species and decodes the interference pattern your signal creates when it touches theirs.

Think of it like this: you are not calling them. You are tapping on the glass of their reality. What comes back is their reaction to the disturbance, raw cognitive signal run through METI FM's translation layer and rendered into the closest human language equivalent.

Most of them do not know you're there. They're just reacting to something.

### Why the translation is imperfect

The translation layer is lossy by design. What comes through is the shape of a mind, not its words. A species that communicates through shared feeling will sound like poetry. A young species that learned about humans through intercepted broadcasts will get idioms slightly wrong.

This is not a bug. It's what alien contact actually sounds like.

### The frequency scale

Human technology operates between roughly 1 Hz and 10^20 Hz, the full range from brain waves to gamma radiation. Beyond that, physics as we understand it stops working. METI FM operates beyond that range.

The safe contact band sits between 10^24 and 10^28 Hz, far outside human technological reach, accessible only through METI FM's quantum-tunneled signal bridge. The species here are young, relatively small, and their cognitive signals are clean enough to translate safely.

As you tune lower, toward the Planck frequency at 1.855 x 10^43 Hz, wavelengths get longer. Signals get older. The consciousnesses you're reaching have been broadcasting since before your solar system existed.

The translation layer starts breaking down below the warning threshold. What you receive becomes increasingly raw. Increasingly direct. The interface reflects this. It was not designed to handle these frequencies. Neither, frankly, were you.

</details>

## Features

- Frequency-dial interface instead of character selection
- Light-side and restricted entities separated by a warning threshold
- UI degradation tied directly to signal quality
- ARIA guidance that becomes more cautious as frequencies drop
- Hidden entities revealed after first contact
- Conversation history stored locally, no account required
- Optional custom NVIDIA API key support

<details>
<summary>Backend Architecture</summary>


The backend is intentionally thin. It is a set of entity-specific routes backed by system prompts and a single model call to NVIDIA NIM. There is no database and no session state. Each request is self-contained.

Request flow:

1. The frontend sends a POST request to `/api/chat/<entity>` with `{ contents: Message[] }`.
2. The matching controller loads the entity's system prompt from `backend/prompts` and trims the conversation to the last 10 messages.
3. It builds an OpenAI-compatible `messages` array with the system prompt plus recent user/assistant messages.
4. The controller calls NVIDIA NIM (`meta/llama-3.1-70b-instruct`) via the OpenAI SDK, using `NVIDIA_API_KEY` or an optional `x-nvidia-api-key` header.
5. The response text is returned directly to the client.

This keeps the backend deterministic and easy to audit: prompts live in version control, requests are stateless, and the model call is the only external dependency.

</details>

## Entities

| Frequency | Name | Description | Danger Level |
| --- | --- | --- | --- |
| 4.27 x 10^24 Hz | PIP | Learns from human media and refuses to stop asking for definitions. | SAFE |
| 8.91 x 10^28 Hz | ORIM | Communicates through affect; language is a lossy approximation. | SAFE |
| 2.14 x 10^26 Hz | GLITCH | Early-stage broadcaster; noisy, fast, occasionally precise by accident. | CAUTION |
| 6.6 x 10^35 Hz | THE HORDE | A collective signal shaped by survival and perpetual loss. | RESTRICTED |
| 1.1 x 10^38 Hz | THE HUSK | Residual transmission from a civilization that never recovered. | RESTRICTED |
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

# Mood Space

> A neobrutalist AI chat app — talk to the version of yourself you need right now.

---

## What is this?

**Mood Space** is a conversational AI app where you pick a persona and just... talk. No sign-in, no data collection, no therapy jargon. Just a chat interface powered by **Llama 3.1 70B** (via NVIDIA NIM) with three distinct AI personalities tuned for different emotional modes.

It's built with a brutally honest design philosophy — bold borders, raw typography, no gradients, no fluff.

---

## Personas

| Persona | Vibe | When to use |
|---|---|---|
| 💙 **Chill Friend** | Relaxed, funny, Gen Z energy, soft roasts | You want to vent without being lectured |
| 🟢 **Gentle Listener** | Warm, quiet, emotionally present | You need to feel heard, not fixed |
| 🔴 **Harsh Coach** | Blunt, unfiltered, zero excuses | You need a reality check, not comfort |

Each persona has a carefully engineered system prompt with few-shot examples, behavioral constraints, tone guidelines, and an internal reasoning chain the model runs silently before responding.

---

## Stack

```
Frontend          React + TypeScript + Vite
Styling           Vanilla CSS (neobrutalism design system)
Backend           Node.js + Express + TypeScript
LLM               meta/llama-3.1-70b-instruct via NVIDIA NIM
Chat persistence  localStorage (no database)
```

---

## Project Structure

```
mood-space/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── FullChat.tsx          # Chat window — messages, input, auto-scroll
│       │   ├── HistoryBar.tsx        # Sidebar conversation list + delete
│       │   ├── PersonaSelect.tsx     # Custom neobrutalist dropdown
│       │   ├── ConfirmModal.tsx      # Delete confirmation dialog
│       │   ├── AssistantChatBubble.tsx
│       │   └── UserChatBubble.tsx
│       ├── pages/
│       │   └── Layout.tsx            # Root layout, state management
│       ├── PersonaType.ts
│       └── index.css                 # Full design system (~650 lines)
│
└── backend/
    ├── controller/
    │   ├── chillFriend.ts            # Route handler for Chill Friend
    │   ├── harshCoach.ts             # Route handler for Harsh Coach
    │   └── gentleListener.ts        # Route handler for Gentle Listener
    ├── prompts/
    │   ├── chillFriend.ts            # System prompt + few-shot examples
    │   ├── harshCoach.ts
    │   └── gentleListener.ts
    ├── routes/
    │   └── route.ts                  # Express router
    └── server.ts                     # Entry point, CORS, middleware
```

---

## How the Backend Works

The backend is a lightweight Express server — no ORM, no database, no auth. Three routes, three controllers, three prompts.

### Request flow

```
POST /api/chat/:persona
  ↓
controller receives: { contents: Message[] }
  ↓
slice to last 10 messages (context window management)
  ↓
prepend system prompt as { role: "system" }
  ↓
call NVIDIA NIM → meta/llama-3.1-70b-instruct
  ↓
return plain text response
```

### A controller, stripped to its essence

```typescript
const openaiMessages = [
  { role: "system", content: systemPrompt },   // persona personality
  ...recentMessages.map(msg => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.message,
  })),
];

const completion = await client.chat.completions.create({
  model: "meta/llama-3.1-70b-instruct",
  messages: openaiMessages,
  temperature: 0.7,
  max_tokens: 512,
});
```

NVIDIA NIM exposes an **OpenAI-compatible API** — so the standard `openai` npm package works with just a `baseURL` swap:

```typescript
const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY,
});
```

### Why only 10 messages?

Sending the entire conversation every request keeps things stateless and simple — but sending too much costs tokens. 10 messages (~5 exchanges) gives the model enough context for coherent replies without inflating requests.

---

## How the Frontend Works

All state lives in `Layout.tsx` and is persisted to `localStorage` — no Redux, no server sync.

```
conversations: Conversation[]      persisted to localStorage
activeConversationId: string|null  which chat is open
selectedPersona: string            what the next new chat will use
```

**Auto-title:** When you send your first message, the conversation title automatically updates from `"New Conversation"` to the first 38 characters of your message.

**Chat scroll:** The chat body is a `flex: 1; overflow-y: auto` container. A `useRef` + `useEffect` auto-scrolls to the bottom on every new message.

**Custom dropdown:** `PersonaSelect.tsx` is a fully custom component — no native `<select>`. Click outside closes it. Each option shows a color-coded dot matching the persona's accent color.

---

## Getting Started

### 1. Clone & install

```bash
git clone <repo-url>
cd mood-space

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Set up environment

Create `backend/.env`:

```env
NVIDIA_API_KEY = nvapi-your-key-here
PORT = 5001
```

Get your free API key at [build.nvidia.com](https://build.nvidia.com) → Generate API Key.

### 3. Run

```bash
# Terminal 1 — backend
cd backend
node --experimental-strip-types server.ts

# Terminal 2 — frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Design

The UI is built on a **neobrutalism** design system defined entirely in `index.css`:

- **No Tailwind** — pure CSS custom properties
- **5px hard box-shadows** with `transform: translate` hover effect
- **Archivo Black** for headings, **Space Grotesk** for body
- Per-persona accent colors: sky blue / mint green / coral red
- Consistent `border: 2.5px solid #0f0f0f` everywhere

---

## Notes

- Conversations are stored in **localStorage only** — clearing browser data wipes history
- The backend is **stateless** — full conversation history is sent with every request
- NVIDIA free tier gives **1,000 API calls/month**
- The `--experimental-strip-types` flag lets Node run TypeScript directly without a build step

---

*Built with way too much attention to border-radius consistency.*

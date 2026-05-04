export const Persona = {
  ChillFriend: "ChillFriend",
  GentleListener: "GentleListener",
  HarshCoach: "HarshCoach"
} as const;

export type Persona = typeof Persona[keyof typeof Persona];
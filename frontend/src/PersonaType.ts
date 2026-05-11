export const Persona = {
  chillFriend: "chillFriend",
  gentleListener: "gentleListener",
  harshCoach: "harshCoach"
} as const;

export type Persona = typeof Persona[keyof typeof Persona];
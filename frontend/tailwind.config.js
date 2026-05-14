/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ── METI FM Entity Colors ─────────────────────────────
        pip: {
          DEFAULT: "hsl(var(--pip))",
          foreground: "hsl(var(--pip-foreground))",
        },
        orim: {
          DEFAULT: "hsl(var(--orim))",
          foreground: "hsl(var(--orim-foreground))",
        },
        glitch: {
          DEFAULT: "hsl(var(--glitch))",
          foreground: "hsl(var(--glitch-foreground))",
        },
        horde: {
          DEFAULT: "hsl(var(--horde))",
          foreground: "hsl(var(--horde-foreground))",
        },
        vorrk: {
          DEFAULT: "hsl(var(--vorrk))",
          foreground: "hsl(var(--vorrk-foreground))",
        },
        husk: {
          DEFAULT: "hsl(var(--husk))",
          foreground: "hsl(var(--husk-foreground))",
        },
        signal: {
          DEFAULT: "hsl(var(--signal))",
          foreground: "hsl(var(--signal-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        neo: "var(--shadow-neo)",
        "neo-sm": "var(--shadow-neo-sm)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        display: ["Archivo Black", "sans-serif"],
        brand: ["Unica One", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

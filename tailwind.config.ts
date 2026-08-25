import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F4EE',
        ink: {
          DEFAULT: '#1B1A17',
          soft: '#33312B',
        },
        moss: {
          DEFAULT: '#3E4E3B',
          light: '#6B7C63',
          dark: '#2B3729',
        },
        brass: {
          DEFAULT: '#A9835C',
          light: '#C7A480',
        },
        stone: {
          DEFAULT: '#8F8877',
          light: '#B7B0A0',
        },
        mist: '#EBE7DC',
        line: '#DBD5C6',
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.25rem, 7vw, 7.5rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(2rem, 3.4vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        widest2: '0.22em',
      },
      maxWidth: {
        container: '1440px',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

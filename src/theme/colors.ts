// Bored Doom color system. Same hex values as the prototype, so native
// screens match it pixel for pixel.
export const colors = {
  bg: '#16302B',        // deep forest teal — screens
  bg2: '#1E3D36',       // cards & buttons
  bg3: '#0F2420',       // pressed edge / shadows
  cream: '#F9F6F0',     // primary text on dark
  muted: '#A9BDB7',     // secondary text on dark
  line: '#24453F',      // dividers
  amber: '#E88D4F',     // primary accent (buttons, SOS)
  amberDark: '#B9652F', // button bottom edge
  gold: '#F2CC6B',
  mint: '#9FD0BD',
  green: '#7BC47F',
  ink: '#16302B',       // text on cream
  ink2: '#4A635D',
  cardCream: '#F9F6F0',
  danger: '#FF6B5E',
} as const;

export const radius = { card: 28, sheet: 32, pill: 999 } as const;
export const font = { family: 'Nunito' } as const;

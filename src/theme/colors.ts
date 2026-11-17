// Bored Doom color system — the exact values the prototype uses (CSS :root),
// so native screens match it pixel for pixel. Keep these in sync with the
// prototype's :root block and docs/UI_AUDIT.md.
export const colors = {
  // surfaces
  bg: '#16302B',        // deep forest teal — screen background
  bg2: '#1E3D37',       // cards, list buttons, chips
  bg3: '#0F2420',       // pressed edge / deep shadow
  line: '#2E4F48',      // dividers, outlines
  cream: '#F9F6F0',     // cream cards + primary text on dark
  creamDark: '#DDD6C8', // cream card edge
  illo: '#FEF4E8',      // illustration backdrop
  // text
  ink: '#16302B',       // text on cream
  ink2: '#4A635D',      // secondary text on cream
  muted: '#A9BDB7',     // secondary text on dark
  // accents
  amber: '#E88D4F',     // primary action, SOS, highlights
  amberDark: '#C26E36', // primary button bottom edge
  gold: '#F2CC6B',      // streaks, Locked In, "sun"
  green: '#7BC47F',     // toggles on, success
  mint: '#9FD0BD',      // progress, calm
  coral: '#E5604D',     // slips, warnings
  danger: '#FF6B5E',    // destructive text (Delete account)
  // night palette (Bedtime / Phone-down screens)
  nightBg: '#0B1420',
  nightCard: '#121C26',
  nightLine: '#1E2C3A',
} as const;

export type ColorName = keyof typeof colors;

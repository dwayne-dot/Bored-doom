// Design tokens shared by every native screen. Values are lifted from the
// prototype so the port feels identical. Units are points (dp).

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, screen: 20 } as const;

export const radius = {
  chip: 999,
  button: 999,   // primary / ghost buttons are pills
  card: 28,      // all dark cards and list buttons ("toolkit style")
  sheet: 32,     // bottom sheets, large cards
  tile: 26,      // You-screen plan tiles, closet tiles
  iconBubble: 19, // 38pt circle behind list icons
} as const;

// Nunito everywhere. Weights: 600 body, 700 labels, 800 buttons, 900 headings.
export const type = {
  display:  { size: 32, lineHeight: 36, weight: '900' },   // "You", "Milo", screen titles
  h1:       { size: 28, lineHeight: 34, weight: '900' },   // greeting, onboarding headings
  h2:       { size: 23, lineHeight: 28, weight: '900' },   // sheet titles
  h3:       { size: 19, lineHeight: 24, weight: '900' },   // card titles
  title:    { size: 17, lineHeight: 22, weight: '800' },   // list row title, button text
  body:     { size: 15, lineHeight: 20, weight: '600' },   // paragraphs
  label:    { size: 14, lineHeight: 18, weight: '800' },   // chips, tabs-in-cards
  caption:  { size: 13, lineHeight: 18, weight: '600' },   // row subtitles, hints
  micro:    { size: 12, lineHeight: 16, weight: '700' },   // tab labels, tiny notes
  overline: { size: 11, lineHeight: 14, weight: '900', letterSpacing: 1.3 }, // "COMPANION ID", section eyebrows
  timer:    { size: 76, lineHeight: 80, weight: '900' },   // SOS / phone-down clock
} as const;

// The "toolkit" tactile surface: every dark card and list button.
export const tactile = {
  edge: 4,          // inset bottom edge (rgba(0,0,0,.16))
  edgePressed: 2,
  pressOffsetY: 2,  // card sinks 2pt while pressed
  pressScale: 0.985,
} as const;

// Motion vocabulary. Reanimated: use withSpring for "spring", withTiming for "ease".
export const motion = {
  ease: [0.2, 0.8, 0.2, 1] as const,              // --ease
  spring: [0.32, 0.72, 0, 1] as const,            // --spring (tab slide, sheets)
  springConfig: { damping: 18, stiffness: 170, mass: 0.9 }, // Reanimated equivalent
  overshoot: { damping: 12, stiffness: 220, mass: 0.8 },    // pops, stamps, paw reveal
  tabSlide: 950,     // ms — slow, springy tab transition
  sheet: 420,
  flipHalf: 200,     // ID card: 0→90° then −90→0 with overshoot
  flipBack: 560,
  pressFeedback: 120,
  reveal: 700,       // paw-shaped mask reveal (SOS, modals)
  stamp: 450,        // ISSUED / RENEWED stamp slam
} as const;

// Haptic vocabulary (expo-haptics). Use names, not raw calls, so the feel stays consistent.
export const hapticName = {
  tap: 'selection',        // chips, toggles, carousel snap
  press: 'light',          // any button
  confirm: 'medium',       // primary actions, card flip
  heavy: 'heavy',          // SOS press, Locked In engage
  success: 'success',      // win screen, renewal, stamp
  warning: 'warning',      // slip logged
  error: 'error',          // locked feature tapped
} as const;

export const layout = {
  tabBarHeight: 84,
  sosButton: 66,
  listIcon: 38,
  minTouch: 44,
} as const;

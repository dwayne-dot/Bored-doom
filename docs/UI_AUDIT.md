# UI audit — Nov 17, 2026

Reviewed every screen of the prototype as product design, graphic design, UI/UX, systems design and engineering. Fixed items are applied in the prototype; the rest are decisions for the native build.

## Fixed in the prototype

1. **Broken cards (bug):** "Your Milo Wrapped is ready" (Insights) and "Unlock everything with Pro" (Milo) rendered dark-on-dark after the global card restyle. Now `rowcard cream` — cream card, ink text.
2. **Touch targets:** chips, FAQ rows, list rows, tabs and icon buttons now have a 44pt minimum (Apple HIG).
3. **Focus rings** for keyboard/Switch Control users (gold outline), no effect on touch.
4. **Prototype-only controls** ("Skip timer (prototype)" in SOS, "runs for 15 seconds" in Phone-down) are labelled and hidden in the native wrapper (`.proto-only`).
5. **Disabled state** unified (45% opacity, no press).

## Design-system decisions (apply in native)

- **One surface language:** every dark card/list button = bg2, 28pt radius, 4pt inset bottom edge, sinks 2pt on press. Cream cards (ID, win, sheets) = cream with a 10% ink edge. No bordered/outlined cards except the gold Locked In card.
- **Type scale** (`src/theme/tokens.ts`): the prototype uses 40+ ad-hoc sizes; native uses 11 named styles. Nunito 600/700/800/900 only.
- **Icon system:** 38pt light bubble + 24pt filled Finch-style glyph in lists; Lucide outline glyphs only for small inline icons (chevrons, close, check). Custom icons exported from Figma as SVG components.
- **Colour roles:** amber = action, gold = streak/strict, green = on/success, coral = slips, mint = calm/progress. Never use amber as a status colour.
- **Night palette** (Bedtime, Phone-down) is intentional and stays navy.
- **Motion:** two curves only (ease, spring) + overshoot for celebrations. Reduce Motion = instant state changes, no confetti/rings/sparks.
- **Haptics:** by name (`hapticName`), never ad-hoc.

## UX decisions

- Account lives behind Milo's ID (flip); front hints "Account". App Review notes must state the deletion path.
- AI replies off until consent (sheet on first message). Journal personalisation separate, off by default.
- SOS and breathing stay free, never paywalled, never behind a sign-in.
- Locked In: no in-app off switch; FAQ explains the iOS Screen Time escape hatch.
- Social (pack): mute / report / block / remove on every friend.
- ID card renewal every 30 days is a retention loop; keep it light (photo + stats), never a nag more than once a day.

## Open items for the native build

- **Dynamic Type:** respect `fontScale` up to 1.3 in cards; clamp timers/headlines.
- **VoiceOver:** every icon-only button needs `accessibilityLabel`; Milo images are decorative (`accessible={false}`) except the mood faces (label = mood).
- **Colour contrast:** `muted` on `bg2` is 5.6:1 (AA). `ink2` on cream is 6.9:1. Keep amber only for ≥17pt bold text on dark (3.9:1).
- **Performance:** the heat-map, mood bars and ID card use plain Views; the paw reveal and card flip use Reanimated 4 worklets; confetti/sparks via Reanimated, not JS timers.
- **State:** single `AppState` (`src/model/state.ts`), persisted with AsyncStorage, migrated by version key. Server sync (accounts) comes in Phase 5+.
- **Not yet designed:** Android back behaviour, landscape (locked portrait), iPad (not supported in v1), offline paywall error (exists in prototype).

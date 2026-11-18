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

## Refinement pass — Nov 18 (senior design + engineering review)

Audited ~45 screens, sheets and overlays in both light and dark mode, then fixed:

**Bugs**
- **Screens bled through each other.** Lower screens' content painted over the screen on top (e.g. the SOS swap tiles showing through the win screen). Cause: `.scroll{z-index:1}` escaped into the shared stacking context. Fix: every `.screen` is now its own stacking context (`isolation:isolate`). Native: not applicable (each screen is its own view), but keep z-index local to a screen.
- **Overlays survived navigation.** The toolkit, journal and paw-walk layers stayed open when jumping to another screen. `resetTo()` now dismisses them (and stops a playing voice note).

**Light-mode legibility**
- Text tinted for dark backgrounds (feeling chips, journal quotes, "Getting calmer"/Freebie pills, timeline labels, FAQ answers, feedback rows) now uses deep greens/teals on light surfaces.
- Segmented controls (Talk/Outfits/Room, Milo's picks tabs) had a white indicator on a white track; the track is now sunken cream with a white, lightly shadowed indicator.
- The pack "Jade hit SOS" alert keeps light text on its warm red card; the plan builder's selected chip keeps cream text.
- The journal overlay is a warm cream wash in light mode (was near-black).
- White cards on cream get a hairline 5% outline for definition.

**Consistency**
- SOS "Try one instead" label is real sentence case (the CSS case trick failed on a flex container), and the swap tiles use one clean border style (amber for your own swaps, green when done).
- Flat, ledge-free buttons everywhere (see BUILD_SPEC 4.59).

**Accessibility**
- Active tab announces `aria-current="page"`.
- Reduce Motion defaults to the system setting on first launch.
- Visible amber focus ring (`:focus-visible`) for keyboard / switch control users.

**Code health**
- Removed ~60 lines of dead CSS left from the retired journal filter experiments (dial, two-tab filter); prototype is 7 KB lighter.

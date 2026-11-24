# Bored Doom

Milo, a playful bad-habit breaker and companion app. React Native + Expo (TypeScript, Expo Router).

## Run it on your iPhone (Expo Go)

```bash
git clone <this repo>
cd bored-doom
npm install
npx expo start
```

Scan the QR code with the iPhone camera (Expo Go must be installed). If the phone and computer are on different networks, run `npx expo start --tunnel`.

## See the native components

In the app: **You → Help & support → Native design system** (orange button at the bottom). That screen is 100% React Native.

## Update the prototype

Edit `prototype/source/index.html`, then run `python3 scripts/build-prototype.py`.

## What's here now (Phase 1)

- Expo SDK 58, Expo Router, Reanimated, Haptics, Notifications, AsyncStorage, Lucide icons, SVG — installed and configured.
- `src/theme/colors.ts` — the color system.
- `src/lib/haptics.ts` — one haptics helper for the whole app.
- `src/prototype/prototype.html` + `src/components/PrototypeView.tsx` — the full interactive prototype running inside the app with native haptics, so you can feel it on a real phone today. Native screens will replace it phase by phase.

## Milo's 3D room

Milo tab → **Room** → **Play with Milo in 3D** opens `app/room.tsx`, a native Three.js room
(`@react-three/fiber/native` + `expo-gl`) drawn behind Milo:

- Flick the tennis ball to throw it (gravity, bounces, rolling), tap it to pop it up.
- Rub Milo for floating 3D hearts; he watches the ball and gets excited when you throw.
- Day / Sunset / Night lighting (starts from the phone's clock), tilt parallax (`expo-sensors`) or drag to look around.

Code: `src/components/scene/` (room, ball, particles, lighting, bridge) and
`src/components/milo/driver.ts` (one Milo control API: PNG poses today, Rive `MiloVM` later).
Runs in Expo Go. Rive will need a development build.

## Folder structure

```
app/                 screens (Expo Router: file = route)
  _layout.tsx        root stack
  index.tsx          home (prototype for now)
  design.tsx         native design system (Phase 2)
src/
  components/        reusable UI (Milo, buttons, cards)
  theme/             colors, spacing, typography
  lib/               haptics, storage, notifications helpers
  prototype/         the bundled HTML prototype (generated)
  model/             typed app state
  icons/             generated icon artwork
prototype/source/    prototype source (edit here)
scripts/             build-prototype.py
docs/                SCREEN_MAP.md, UI_AUDIT.md
assets/
  icon.png, splash-milo.png, milo/*.png
```

## Phases

1. Project setup & folder structure ✅
2. Design system & Milo component ✅ (`src/components/ui`, `src/components/milo`, `src/components/icons`, `app/design.tsx`)
3. Home screen & mood check-in
4. SOS timer & haptics
5. Local storage & notifications
6. Paywall & widget setup

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

## What's here now (Phase 1)

- Expo SDK 58, Expo Router, Reanimated, Haptics, Notifications, AsyncStorage, Lucide icons, SVG — installed and configured.
- `src/theme/colors.ts` — the color system.
- `src/lib/haptics.ts` — one haptics helper for the whole app.
- `src/prototype/prototype.html` + `src/components/PrototypeView.tsx` — the full interactive prototype running inside the app with native haptics, so you can feel it on a real phone today. Native screens will replace it phase by phase.

## Folder structure

```
app/                 screens (Expo Router: file = route)
  _layout.tsx        root stack
  index.tsx          home (prototype for now)
src/
  components/        reusable UI (Milo, buttons, cards)
  theme/             colors, spacing, typography
  lib/               haptics, storage, notifications helpers
  prototype/         the HTML prototype asset
assets/
  icon.png, splash-milo.png, milo/*.png
```

## Phases

1. Project setup & folder structure ✅
2. Design system & Milo component
3. Home screen & mood check-in
4. SOS timer & haptics
5. Local storage & notifications
6. Paywall & widget setup

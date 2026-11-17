# Screen map — prototype → React Native

Every screen in the prototype (`SCREENS.x`), where it lives in Expo Router, and the components it needs. Build order follows the phases; a screen is "done" when it replaces its WebView counterpart and passes the checks in `docs/UI_AUDIT.md`.

## Navigation shell

| Prototype | Expo Router | Notes |
|---|---|---|
| tab bar (today, insights, SOS, milo, you) | `app/(tabs)/_layout.tsx` custom tab bar | Centre SOS button overlaps the bar (66pt amber circle, pulse). Tab switch = springy slide (~950 ms). |
| `push(name, params, 'modal')` | `app/(modals)/…` with `presentation: 'transparentModal'` | Paw-shaped reveal (Reanimated mask, Skia optional) 700 ms. |
| `openSheet(html)` | `components/Sheet.tsx` (Gorhom bottom sheet or Reanimated) | Cream, 32pt radius, grabber. |
| `iosAlert` | `Alert.alert` | Native. |
| `toast` | `components/Toast.tsx` | Bottom, 2.2 s. |
| tour panel (`#tour`) | — | Prototype only. Not ported. |

## Tabs

| Prototype | Route | Components |
|---|---|---|
| `today` (Home) | `app/(tabs)/index.tsx` | `Greeting`, `MiloHero` (weather pose, rubbable), `MoodCarousel`, `ToolkitBagCard` (opens `ToolkitRing`), `LockedInCard`, `IdRenewNudge` |
| `insights` | `app/(tabs)/insights.tsx` | `StreakCard`, `WrappedCard`, `HeatmapGrid`, `YourWordsCard`, `MoodBars`, `UrgeClockCard`, `ScreenTimeCard`, `MiloNoticedCard` + `HelpfulRow` |
| `milo` (Talk / Outfits / Room) | `app/(tabs)/milo.tsx` | `SegmentedTabs`, `TalkThread` (`MessageBubble`, `Composer` with mic), `Closet` (`ItemTile`), `Room` (`RoomCanvas`), `TreatsPill` |
| `you` | `app/(tabs)/you.tsx` | `MiloIdCard` (flip + account drawer), `PlanTiles`, `SettingsList` (`PawToggle`), account groups |

## Modals & flows

| Prototype | Route | Components |
|---|---|---|
| onboarding (`startOnb`) | `app/onboarding/[step].tsx` or a single screen with internal steps | `GlassIntro`, `ProgressRing` (heat colour), `NameInput`, `BandanaPicker`, `IdPicker`, `HabitCards` (swipe), `DangerDial` (drag), `FirstWin`, `PawPromise`, `NotifPrimer`, `ShieldPrimer`, `Done` → paywall |
| `sos` → `win` | `app/(modals)/sos.tsx`, `win.tsx` | `WaveTimer` (ring + Milo), `MiloLine`, `ReplacementChips`, `TalkToMiloInline`, `WinScreen` (+`HelpfulRow`) |
| `slip` | `app/(modals)/slip.tsx` | 4-step: tell Milo, note, mercy, reset |
| `breathe` | `app/(modals)/breathe.tsx` | `BreathCircle` synced to haptics (4-4-6) |
| `picks` / `deck` | `app/(modals)/picks.tsx`, `deck.tsx` | `PickRow`, `SwipeDeck` (`BoosterCard`) |
| `feed` | `app/(modals)/feed.tsx` | `FiniteFeed` (10 cards, progress) |
| `findmilo` | `app/(modals)/find-milo.tsx` | `RoomPan` (drag/gyro), `PetMilo` |
| `shield`, `phonedown`, `bedtime`, `lockin` | one route each | `ShieldSettings`, `PhoneDownTimer` (night palette), `BedtimeMode`, `LockedInSetup` (`LockGroupRow`, `DurationChips`, hold-to-confirm) |
| `why` | `app/(modals)/why.tsx` | `WhyEditor` (photo picker) |
| `wrapped` | `app/(modals)/wrapped.tsx` | `StorySlides` (tap sides) |
| `journal` | `app/journal.tsx` | `JournalList` |
| `pack` | `app/pack.tsx` | `ParkScene`, `FriendRow` (+ ••• menu: mute/report/block/remove), `QrInviteSheet` |
| `account`, `sub`, `privacy`, `display`, `help` | `app/settings/*.tsx` | `AccountGroups`, `PlanCard`, `AiPrivacy` (+ `AiConsentSheet`), `DisplaySettings`, `HelpCenter` (`FaqItem`, crisis banner) |
| `renew` | `app/(modals)/renew-id.tsx` | `PhotoBooth`, `IdPreview`, `IdStyleChips`, stamp |
| `login` | `app/login.tsx` | Apple / Google / email magic link |
| paywall | `app/paywall.tsx` | `PlanPicker` (weekly/monthly/yearly), trial note, RevenueCat later |
| `notifs`, `widget`, `native`, `forecast` | — | Prototype demos; widget → `targets/` (WidgetKit) later |

## Shared components (Phase 2)

`TactileCard`, `TactileRow` (icon bubble + title + subtitle + chevron/switch), `PrimaryButton`, `GhostButton`, `Chip`, `PawToggle`, `IconBubble`, `Overline`, `Milo` (image poses now, Rive later), `MiloFace`, `PawIcon`, `KitIcon` (8 Finch-style SVGs from Figma), `TabIcon`, `Sheet`, `Toast`, `ProgressRing`, `HelpfulRow`.

Icons: `lucide-react-native` for generic glyphs; the custom ones (paw, lock, toolkit set, You icons) as `react-native-svg` components exported from Figma (`YGcFwIolFNHO7q8SjiU6Ec`).

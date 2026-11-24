// Milo's 3D room: a Three.js room behind Milo, a tennis ball to throw,
// hearts when you pet him, Day / Sunset / Night light, and tilt parallax.
// Milo is a normal view drawn ON TOP of the 3D canvas (PNG today, Rive
// later through the same MiloDriver), placed on his 3D floor spot.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeOut, runOnJS, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring,
} from 'react-native-reanimated';
import { Moon, Sun, Sunset, X } from 'lucide-react-native';
import { Vector3 } from 'three';
import { Text } from '@/components/ui';
import { Milo } from '@/components/milo/Milo';
import { usePngMiloDriver, type MiloMood } from '@/components/milo/driver';
import { hapticByName } from '@/lib/haptics';
import { colors } from '@/theme';
import { RoomCanvas } from './RoomCanvas';
import { burst, createBridge, popBall, ROOM, throwFromSwipe, type Bridge, type TimeOfDay } from './bridge';
import { timeOfDayNow } from './environment';
import { useTilt } from './useTilt';

const MILO_PX = 300;          // render size of the Milo view before scaling
const MILO_METRES = 1.05;     // how tall Milo's artboard is in the room
const FEET = 342 / 360;       // feet baseline inside the artboard (Rive brief)
const HEAD = new Vector3(ROOM.milo.x, 1.05, ROOM.milo.z);

export function MiloRoomScreen() {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const bridge = useMemo<Bridge>(createBridge, []);
  const [tod, setTod] = useState<TimeOfDay>(timeOfDayNow);
  const [hint, setHint] = useState(true);
  const restMood: MiloMood = tod === 'night' ? 'calm' : 'happy';
  const milo = usePngMiloDriver(restMood);
  const { driver } = milo;

  bridge.reduceMotion = !!reduce;
  useTilt(bridge, !reduce);

  // Where Milo stands on screen, updated by the 3D projector every frame.
  const footX = useSharedValue(-999);
  const footY = useSharedValue(-999);
  const ppm = useSharedValue(200);
  const look = useRef({ x: 0, y: 0 });
  const spot = useRef({ x: -999, y: -999, ppm: 200 });   // JS copy for hit-testing
  const petTilt = useSharedValue(0);
  const petting = useSharedValue(0);
  const hiddenSince = useRef(0);

  useEffect(() => { driver.setMood(restMood); }, [restMood, driver]);

  // 3D -> Milo: place him, aim his eyes at the ball, nudge a hidden ball.
  useEffect(() => {
    bridge.onFrame = (b) => {
      const m = b.milo.screen;
      footX.value = m.x; footY.value = m.y; ppm.value = m.pxPerMetre;
      spot.current = { x: m.x, y: m.y, ppm: m.pxPerMetre };
      const headX = m.x, headY = m.y - m.pxPerMetre * 0.85;
      const now = Date.now();
      // Watch the ball while it moves and for a few seconds after; then look back at you.
      const watching = !b.ball.resting || b.time - b.ball.restSince < 4;
      const tx = watching ? Math.max(-1, Math.min(1, (b.ball.screen.x - headX) / (m.pxPerMetre * 1.6))) : 0;
      const ty = watching ? Math.max(-1, Math.min(1, (b.ball.screen.y - headY) / (m.pxPerMetre * 1.6))) : 0;
      look.current.x += (tx - look.current.x) * 0.18;
      look.current.y += (ty - look.current.y) * 0.18;
      driver.setLook(look.current.x, look.current.y);

      // If the ball stops behind Milo, he bumps it back out with a hop.
      const h = m.pxPerMetre * MILO_METRES;
      const ex = (b.ball.screen.x - m.x) / (h * 0.26), ey = (b.ball.screen.y - (m.y - h * 0.45)) / (h * 0.4);
      const behind = b.ball.resting && ex * ex + ey * ey < 1;
      if (!behind) hiddenSince.current = 0;
      else if (!hiddenSince.current) hiddenSince.current = now;
      else if (now - hiddenSince.current > 1200) {
        hiddenSince.current = 0;
        const dir = b.ball.pos.x >= ROOM.milo.x ? 1 : -1;
        b.pending.impulse = new Vector3(dir * 1.6, 2.2, -0.9);
        driver.fire('hop');
      }
    };
    return () => { bridge.onFrame = null; };
  }, [bridge, driver, footX, footY, ppm]);

  // 3D events -> Milo's reactions + haptics.
  useEffect(() => {
    let back: ReturnType<typeof setTimeout> | null = null;
    const on = (e: Parameters<Bridge['emit']>[0]) => {
      if (e.type === 'throw') {
        if (back) clearTimeout(back);
        driver.setMood('excited');
        driver.fire('hop');
        hapticByName(e.speed > 1 ? 'medium' : 'light');
        setHint(false);
      } else if (e.type === 'bounce') {
        if (e.impact > 1.6) hapticByName('light');
      } else if (e.type === 'settle') {
        if (e.nearMilo) {
          driver.fire('celebrate');
          burst(bridge, 'sparkles', HEAD, 12);
          hapticByName('success');
        }
        back = setTimeout(() => driver.setMood(restMood), 900);
      }
    };
    bridge.listeners.add(on);
    return () => { bridge.listeners.delete(on); if (back) clearTimeout(back); };
  }, [bridge, driver, restMood]);

  // One gesture layer handles everything, so the ball works even right next
  // to Milo: flick/tap the ball, rub Milo to pet him, drag elsewhere to look around.
  const mode = useRef<'ball' | 'pet' | 'look'>('look');
  const size = useRef({ w: 390, h: 844 });
  const strokes = useRef(0);
  const t0 = useRef(0);
  const lastStroke = useRef(0);
  const petTick = useCallback(() => {
    const now = Date.now();
    if (now - lastStroke.current < 140) return;
    lastStroke.current = now;
    strokes.current += 1;
    hapticByName('selection');
    if (strokes.current % 3 === 1) burst(bridge, 'hearts', HEAD, 7);
  }, [bridge]);
  const begin = useCallback((x: number, y: number) => {
    t0.current = Date.now();
    const s = bridge.ball.screen;
    const m = spot.current, h = m.ppm * MILO_METRES;
    const onBall = Math.hypot(x - s.x, y - s.y) < Math.max(44, s.r * 2.4);
    const dx = (x - m.x) / (h * 0.33), dy = (y - (m.y - h * 0.45)) / (h * 0.48);
    mode.current = onBall ? 'ball' : dx * dx + dy * dy < 1 ? 'pet' : 'look';
    petting.value = mode.current === 'pet' ? 1 : 0;
    if (mode.current === 'pet') {
      driver.setPetting(true);
      driver.setMood('happy');
      petTick();
      setHint(false);
    }
  }, [bridge, driver, petTick, petting]);
  const drag = useCallback((tx: number, ty: number) => {
    if (mode.current === 'pet') { petTick(); return; }
    if (mode.current !== 'look') return;
    bridge.camera.drag.x = Math.max(-1, Math.min(1, -tx / 180));
    bridge.camera.drag.y = Math.max(-1, Math.min(1, ty / 260));
  }, [bridge, petTick]);
  const end = useCallback((tx: number, ty: number, vx: number, vy: number) => {
    if (mode.current === 'ball') {
      if (Math.hypot(tx, ty) < 12) popBall(bridge);
      else {
        // Some touch screens report ~0 release speed on a quick flick; fall back to the average.
        if (Math.hypot(vx, vy) < 150) {
          const dur = Math.max(0.06, (Date.now() - t0.current) / 1000);
          vx = (tx / dur) * 1.5; vy = (ty / dur) * 1.5;
        }
        throwFromSwipe(bridge, vx, vy, size.current.w, size.current.h);
      }
    } else if (mode.current === 'pet') {
      driver.setPetting(false);
      if (Math.hypot(tx, ty) < 12) { driver.fire('hop'); burst(bridge, 'hearts', HEAD, 5); }
    }
    bridge.camera.drag.x = 0;
    bridge.camera.drag.y = 0;
    petting.value = 0;
  }, [bridge, driver, petting]);

  const pan = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => { runOnJS(begin)(e.x, e.y); })
    .onUpdate((e) => {
      if (petting.value) petTilt.value = Math.max(-8, Math.min(8, e.translationX / 6));
      runOnJS(drag)(e.translationX, e.translationY);
    })
    .onFinalize((e) => {
      petTilt.value = withSpring(0, { damping: 8, stiffness: 180 });
      runOnJS(end)(e.translationX, e.translationY, e.velocityX, e.velocityY);
    });

  const miloStyle = useAnimatedStyle(() => {
    const s = (ppm.value * MILO_METRES) / MILO_PX;
    return {
      opacity: footX.value < -900 ? 0 : 1,
      transform: [
        { translateX: footX.value - MILO_PX / 2 + milo.lookX.value * 8 },
        { translateY: footY.value - MILO_PX * FEET },
        { scale: s },
        { rotate: `${milo.lookX.value * 6 + petTilt.value}deg` },
        { scaleY: 1 - milo.lookY.value * 0.03 },   // stretches up a little to watch a high ball
      ],
    };
  });

  return (
    <View
      style={styles.root}
      onLayout={(e) => { size.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height }; }}
    >
      <RoomCanvas bridge={bridge} timeOfDay={tod} />

      <GestureDetector gesture={pan}>
        <View style={StyleSheet.absoluteFill} accessible accessibilityLabel="Milo's room. Flick the tennis ball to throw it." />
      </GestureDetector>

      <Animated.View pointerEvents="none" style={[styles.milo, { transformOrigin: `50% ${FEET * 100}%` }, miloStyle]}>
        <Milo pose={milo.pose} size={MILO_PX} hopSignal={milo.hopSignal} accessibilityLabel="Milo. Rub him to pet him." />
      </Animated.View>

      {/* Top bar: close + time of day */}
      <View style={[styles.top, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <Pressable onPress={() => router.back()} style={styles.round} accessibilityRole="button" accessibilityLabel="Close Milo's room" hitSlop={8}>
          <X size={20} color={colors.ink} strokeWidth={2.6} />
        </Pressable>
        <View style={styles.seg} accessibilityRole="tablist">
          {([['day', Sun, 'Day'], ['sunset', Sunset, 'Sunset'], ['night', Moon, 'Night']] as const).map(([k, Icon, label]) => {
            const on = tod === k;
            return (
              <Pressable key={k} onPress={() => { setTod(k); hapticByName('selection'); }} style={[styles.segBtn, on && styles.segOn]}
                accessibilityRole="tab" accessibilityState={{ selected: on }} accessibilityLabel={label}>
                <Icon size={16} color={on ? colors.ink : '#5E7670'} strokeWidth={2.4} />
                <Text variant="label" color={on ? 'ink' : 'ink2'}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {hint && (
        <Animated.View exiting={FadeOut} pointerEvents="none" style={[styles.hint, { bottom: insets.bottom + 24 }]}>
          <Text variant="caption" color="ink" align="center">Flick the ball · Rub Milo · Tilt your phone</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2DCC2' },
  milo: { position: 'absolute', left: 0, top: 0, width: MILO_PX, height: MILO_PX },
  top: { position: 'absolute', left: 0, right: 0, top: 0, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  round: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  seg: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 22, padding: 4, gap: 4 },
  segBtn: { flex: 1, height: 36, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  segOn: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  hint: { position: 'absolute', alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
});

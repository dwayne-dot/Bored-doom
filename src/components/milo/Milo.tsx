import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing, FadeOutUp, ZoomIn, runOnJS, useAnimatedStyle, useReducedMotion,
  useSharedValue, withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { POSES, FACES, type Pose, type Face } from './poses';
import { hapticByName } from '@/lib/haptics';

type Props = {
  pose?: Pose;
  size?: number;
  rubbable?: boolean;       // rub/drag to pet: wiggle, hearts, haptics
  onPet?: (strokes: number) => void;
  breathing?: boolean;      // idle "alive" breathing loop
  hopSignal?: number;       // change this number to make Milo do a little hop
  accessibilityLabel?: string;
};

// Milo, the companion. Static poses now; swap internals for Rive later
// without changing this API (pose / rubbable / onPet).
export function Milo({ pose = 'happy', size = 220, rubbable = false, onPet, breathing = true, hopSignal, accessibilityLabel }: Props) {
  const reduce = useReducedMotion();
  const breath = useSharedValue(1);
  const tilt = useSharedValue(0);
  const lift = useSharedValue(1);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const strokes = useRef(0);
  const lastTick = useRef(0);

  useEffect(() => {
    if (!breathing || reduce) return;
    breath.value = withRepeat(withTiming(1.025, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [breathing, reduce]);

  // Pose change: tiny hop so swaps feel alive.
  useEffect(() => {
    if (reduce) return;
    lift.value = withSequence(withTiming(1.06, { duration: 110 }), withSpring(1, { damping: 9, stiffness: 260 }));
  }, [pose]);

  // External hop (e.g. the 3D room's ball games).
  useEffect(() => {
    if (hopSignal === undefined || reduce) return;
    lift.value = withSequence(withTiming(1.1, { duration: 120 }), withSpring(1, { damping: 7, stiffness: 240 }));
  }, [hopSignal]);

  function petTick(x: number) {
    const now = Date.now();
    if (now - lastTick.current < 140) return;
    lastTick.current = now;
    strokes.current += 1;
    hapticByName('selection');
    onPet?.(strokes.current);
    if (strokes.current % 3 === 0) {
      const id = now;
      setHearts((h) => [...h.slice(-5), { id, x }]);
      setTimeout(() => setHearts((h) => h.filter((k) => k.id !== id)), 900);
    }
  }

  const pan = Gesture.Pan()
    .minDistance(2)
    .onBegin(() => { lift.value = withSpring(1.04); })
    .onUpdate((e) => {
      tilt.value = Math.max(-8, Math.min(8, e.translationX / 6));
      runOnJS(petTick)(e.x);
    })
    .onFinalize(() => {
      tilt.value = withSpring(0, { damping: 8, stiffness: 180 });
      lift.value = withSpring(1);
    });

  const tap = Gesture.Tap().onEnd(() => {
    lift.value = withSequence(withTiming(1.08, { duration: 90 }), withSpring(1, { damping: 8 }));
    runOnJS(hapticByName)('light');
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: breath.value * lift.value }, { rotate: `${tilt.value}deg` }],
  }));

  const img = (
    <Animated.View style={[{ width: size, height: size }, style]}>
      <Image source={POSES[pose]} style={{ width: size, height: size }} contentFit="contain" transition={180}
        accessible accessibilityLabel={accessibilityLabel ?? 'Milo'} />
    </Animated.View>
  );

  return (
    <View style={{ width: size, height: size }}>
      {rubbable ? <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>{img}</GestureDetector> : img}
      {hearts.map((h) => (
        <Animated.View key={h.id} entering={ZoomIn.springify()} exiting={FadeOutUp.duration(600)}
          style={{ position: 'absolute', left: Math.max(10, Math.min(size - 30, h.x - 12)), top: size * 0.18 }} pointerEvents="none">
          <Heart size={24} color="#E9958A" fill="#E9958A" />
        </Animated.View>
      ))}
    </View>
  );
}

// Round face bubble (mood carousel, chat avatar).
export function MiloFace({ face = 'happy', size = 64, bg }: { face?: Face; size?: number; bg?: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: bg ?? '#FCE3D1', alignItems: 'center', justifyContent: 'center' }}>
      <Image source={FACES[face]} style={{ width: size * 0.92, height: size * 0.92 }} contentFit="contain" accessible={false} />
    </View>
  );
}

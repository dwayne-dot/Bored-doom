// One way to control Milo, whatever draws him.
//
// Today Milo is drawn from PNG poses (usePngMiloDriver below). When
// milo.riv arrives, a Rive driver implements this same interface and the
// 3D room (and every other screen) keeps working unchanged. Names follow
// the Rive brief's View Model, MiloVM (data binding, not state machine inputs):
//
//   setLook(x, y)   -> MiloVM.lookX / MiloVM.lookY   (Number, -1..1)
//   setPetting(on)  -> MiloVM.isPetting               (Boolean)
//   setMood(m)      -> MiloVM.mood = MOOD_INDEX[m]    (Number)
//   fire('hop')     -> MiloVM.hop                     (Trigger)
//   fire('celebrate') -> MiloVM.celebrate             (Trigger)
//
// The Rive version needs a development build (EAS); Expo Go can't load
// Rive's native module.
import { useMemo, useRef, useState } from 'react';
import { useSharedValue, type SharedValue } from 'react-native-reanimated';
import type { Pose } from './poses';

export type MiloMood = 'neutral' | 'happy' | 'sad' | 'anxious' | 'calm' | 'thinking' | 'sleepy' | 'excited';
export type MiloTrigger = 'hop' | 'celebrate';

// MiloVM.mood values (Rive brief, section 4).
export const MOOD_INDEX: Record<MiloMood, number> = {
  neutral: 0, happy: 1, sad: 2, anxious: 3, calm: 4, thinking: 5, sleepy: 6, excited: 7,
};

export interface MiloDriver {
  setLook(x: number, y: number): void;
  setPetting(on: boolean): void;
  setMood(mood: MiloMood): void;
  fire(trigger: MiloTrigger): void;
}

// PNG stand-ins for each mood until the Rive file exists.
const MOOD_POSE: Record<MiloMood, Pose> = {
  neutral: 'neutral', happy: 'happy', sad: 'sad', anxious: 'anxious', calm: 'calm',
  thinking: 'thinking', sleepy: 'sleep', excited: 'cheering',
};

export type PngMilo = {
  driver: MiloDriver;
  pose: Pose;
  hopSignal: number;
  lookX: SharedValue<number>;   // the view leans toward what he's watching
  lookY: SharedValue<number>;
};

export function usePngMiloDriver(initial: MiloMood = 'happy'): PngMilo {
  const [mood, setMoodState] = useState<MiloMood>(initial);
  const [override, setOverride] = useState<Pose | null>(null);
  const [hopSignal, setHop] = useState(0);
  const lookX = useSharedValue(0);
  const lookY = useSharedValue(0);
  const petting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const driver = useMemo<MiloDriver>(() => ({
    setLook(x, y) { lookX.value = x; lookY.value = y; },
    setPetting(on) {
      petting.current = on;
      setOverride((o) => (on ? 'happy' : o === 'happy' ? null : o));
    },
    setMood(m) { setMoodState(m); },
    fire(t) {
      setHop((h) => h + 1);
      if (t === 'celebrate') {
        setOverride('celebrate');
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setOverride(petting.current ? 'happy' : null), 1500);
      }
    },
  }), [lookX, lookY]);

  return { driver, pose: override ?? MOOD_POSE[mood], hopSignal, lookX, lookY };
}

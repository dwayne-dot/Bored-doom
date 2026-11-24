// Phone tilt -> camera parallax target (-1..1), via the accelerometer.
// The first readings become "neutral", so however the phone is held the
// room starts centred. No permission prompt is needed on iOS/Android.
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import type { Bridge } from './bridge';

export function useTilt(bridge: Bridge, enabled: boolean) {
  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;
    let sub: { remove: () => void } | null = null;
    let base: { x: number; y: number } | null = null;
    let n = 0;
    (async () => {
      try {
        if (!(await Accelerometer.isAvailableAsync())) return;
        Accelerometer.setUpdateInterval(33);
        sub = Accelerometer.addListener(({ x, y }) => {
          if (n < 6) {                                   // calibrate on the first few samples
            base = base ? { x: (base.x * n + x) / (n + 1), y: (base.y * n + y) / (n + 1) } : { x, y };
            n++;
            return;
          }
          const b = base!;
          const sx = Platform.OS === 'android' ? -1 : 1;  // Android reports the opposite sign
          bridge.camera.tiltTarget.x = Math.max(-1, Math.min(1, (x - b.x) * 2.6 * sx));
          bridge.camera.tiltTarget.y = Math.max(-1, Math.min(1, (y - b.y) * -2.2 * sx));
        });
      } catch { /* no sensor: drag-to-look still works */ }
    })();
    return () => {
      sub?.remove();
      bridge.camera.tiltTarget.x = 0;
      bridge.camera.tiltTarget.y = 0;
    };
  }, [bridge, enabled]);
}

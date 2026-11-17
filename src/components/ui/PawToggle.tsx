import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { PawIcon } from '@/components/icons/Icons';
import { colors } from '@/theme/colors';
import { hapticByName } from '@/lib/haptics';

const W = 51, H = 31, T = 27;

// The paw toggle (Figma "Toggle"): grey track in both states; the round thumb
// carries the paw. Off = white thumb + grey paw, left. On = green thumb + white paw, right.
export function PawToggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  const reduce = useReducedMotion();
  const v = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    v.value = reduce ? (value ? 1 : 0) : withSpring(value ? 1 : 0, { damping: 15, stiffness: 260 });
  }, [value, reduce]);

  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: v.value * (W - T - 4) }],
    backgroundColor: interpolateColor(v.value, [0, 1], ['#FFFFFF', colors.green]),
  }));
  const offPaw = useAnimatedStyle(() => ({ opacity: 1 - v.value }));
  const onPaw = useAnimatedStyle(() => ({ opacity: v.value }));

  return (
    <Pressable
      onPress={() => { hapticByName('selection'); onChange(!value); }}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
    >
      <View style={{ width: W, height: H, borderRadius: H / 2, backgroundColor: '#3A5550', justifyContent: 'center' }}>
        <Animated.View style={[{ position: 'absolute', left: 2, width: T, height: T, borderRadius: T / 2, alignItems: 'center', justifyContent: 'center',
          shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 2, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, thumb]}>
          <Animated.View style={[{ position: 'absolute' }, offPaw]}><PawIcon size={17} color="#93A8A2" /></Animated.View>
          <Animated.View style={onPaw}><PawIcon size={17} color="#FFFFFF" /></Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

// A quick "is it on" animation helper some screens reuse.
export const fade = (on: boolean) => withTiming(on ? 1 : 0, { duration: 180 });

import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Ellipse, G, Path } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { hapticByName } from '@/lib/haptics';

const W = 51, H = 31, T = 28;

// Paw-shaped thumb (the Figma "Toggle"): the knob's outline IS the paw.
function PawThumb({ fill, stroke }: { fill: string; stroke: string }) {
  return (
    <Svg width={T} height={27} viewBox="2 0 31 29">
      <G fill={fill} stroke={stroke} strokeWidth={1.2} strokeLinejoin="round">
        <Path d="M17.5 14.77c-3.92 0-8.13 4.65-8.13 8.42 0 2.47 1.74 3.78 3.92 3.78 1.6 0 2.76-1.02 4.21-1.02s2.61 1.02 4.21 1.02c2.18 0 3.92-1.31 3.92-3.78 0-3.77-4.21-8.42-8.13-8.42z" />
        <Ellipse cx={6.61} cy={12.02} rx={2.61} ry={3.34} />
        <Ellipse cx={13} cy={5.63} rx={2.76} ry={3.63} />
        <Ellipse cx={22} cy={5.63} rx={2.76} ry={3.63} />
        <Ellipse cx={28.39} cy={12.02} rx={2.61} ry={3.34} />
      </G>
    </Svg>
  );
}

// Paw toggle: grey track in both states; the paw-shaped thumb slides.
// Off = white paw on the left. On = green paw on the right.
export function PawToggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label?: string }) {
  const reduce = useReducedMotion();
  const v = useSharedValue(value ? 1 : 0);
  useEffect(() => {
    v.value = reduce ? (value ? 1 : 0) : withSpring(value ? 1 : 0, { damping: 15, stiffness: 260 });
  }, [value, reduce]);

  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: v.value * (W - T - 4) }] }));
  const off = useAnimatedStyle(() => ({ opacity: 1 - v.value }));
  const on = useAnimatedStyle(() => ({ opacity: v.value }));

  return (
    <Pressable onPress={() => { hapticByName('selection'); onChange(!value); }}
      accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{ checked: value }} hitSlop={8}>
      <View style={{ width: W, height: H, borderRadius: H / 2, backgroundColor: '#3A5550', justifyContent: 'center' }}>
        <Animated.View style={[{ position: 'absolute', left: 2, top: 2, width: T, height: 27,
          shadowColor: '#000', shadowOpacity: 0.28, shadowRadius: 2, shadowOffset: { width: 0, height: 2 } }, thumb]}>
          <Animated.View style={[{ position: 'absolute' }, off]}><PawThumb fill="#FFFFFF" stroke="#DCE5E2" /></Animated.View>
          <Animated.View style={on}><PawThumb fill={colors.green} stroke="#63AE68" /></Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { radius as R, tactile } from '@/theme/tokens';
import { shade } from '@/theme/color-utils';
import { hapticByName } from '@/lib/haptics';

// The "Milo's toolkit" surface used by every card and list button:
// rounded, with a darker bottom edge, and it sinks when pressed.
// React Native has no inset shadows, so the edge is a darker layer that
// peeks out under the face; pressing slides the face down over it.

type Props = {
  children: ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  bg?: string;
  edge?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;       // outer (margins, flex)
  contentStyle?: StyleProp<ViewStyle>; // face (padding, layout)
  disabled?: boolean;
  haptic?: boolean;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'switch' | 'link';
  accessibilityState?: { checked?: boolean; disabled?: boolean; selected?: boolean };
};

export function Tactile({
  children, onPress, onLongPress, bg = colors.bg2, edge = tactile.edge, radius = R.card,
  style, contentStyle, disabled, haptic = true, ...a11y
}: Props) {
  const down = useSharedValue(0);
  const face = useAnimatedStyle(() => ({
    transform: [{ translateY: down.value * (edge - tactile.edgePressed) }],
  }));
  const edgeColor = shade(bg, -0.18);
  const interactive = !!(onPress || onLongPress) && !disabled;

  const body = (
    <View style={[{ borderRadius: radius, backgroundColor: edgeColor, paddingBottom: edge }, style]}>
      <Animated.View style={[{ borderRadius: radius, backgroundColor: bg }, contentStyle, face]}>
        {children}
      </Animated.View>
    </View>
  );
  if (!interactive) return body;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        down.value = withTiming(1, { duration: 70 });
        if (haptic) hapticByName('light');
      }}
      onPressOut={() => { down.value = withSpring(0, { damping: 14, stiffness: 320 }); }}
      accessibilityRole={a11y.accessibilityRole ?? 'button'}
      accessibilityLabel={a11y.accessibilityLabel}
      accessibilityState={{ disabled, ...a11y.accessibilityState }}
      style={{ opacity: disabled ? 0.45 : 1 }}
    >
      {body}
    </Pressable>
  );
}

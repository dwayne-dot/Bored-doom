import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { Tactile } from './Tactile';
import { Text } from './Text';
import { hapticByName } from '@/lib/haptics';

type Props = { label: string; onPress?: () => void; icon?: ReactNode; disabled?: boolean };

// Amber pill with a solid 5pt bottom edge (Duolingo-style). The main action on a screen.
export function PrimaryButton({ label, onPress, icon, disabled }: Props) {
  const down = useSharedValue(0);
  const face = useAnimatedStyle(() => ({ transform: [{ translateY: down.value * 4 }] }));
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => { down.value = withTiming(1, { duration: 70 }); hapticByName('medium'); }}
      onPressOut={() => { down.value = withSpring(0, { damping: 13, stiffness: 300 }); }}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={{ opacity: disabled ? 0.45 : 1, alignSelf: 'stretch' }}
    >
      <View style={{ borderRadius: 999, backgroundColor: colors.amberDark, paddingBottom: 5 }}>
        <Animated.View
          style={[{ borderRadius: 999, backgroundColor: colors.amber, minHeight: 56, paddingHorizontal: 22,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, face]}
        >
          {icon}
          <Text variant="title" color="ink">{label}</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

// Secondary action: the toolkit surface as a pill.
export function GhostButton({ label, onPress, icon, disabled, danger }: Props & { danger?: boolean }) {
  return (
    <Tactile onPress={onPress} disabled={disabled} radius={999} accessibilityLabel={label}
      contentStyle={{ minHeight: 54, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {icon}
      <Text variant="title" color={danger ? 'danger' : 'cream'}>{label}</Text>
    </Tactile>
  );
}

// Text-only action ("I slipped, and that's okay", "Not now").
export function LinkButton({ label, onPress, color = 'muted' }: Props & { color?: 'muted' | 'cream' | 'amber' }) {
  return (
    <Pressable onPress={() => { hapticByName('selection'); onPress?.(); }} hitSlop={10}
      accessibilityRole="button" style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 }}>
      <Text variant="label" color={color}>{label}</Text>
    </Pressable>
  );
}

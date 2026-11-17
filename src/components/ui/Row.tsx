import type { ReactNode } from 'react';
import { View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Tactile } from './Tactile';
import { Text } from './Text';
import { IconBubble } from './IconBubble';
import { PawToggle } from './PawToggle';
import { colors } from '@/theme/colors';

type Props = {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: 'chevron' | 'none' | ReactNode;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
};

// List button used across You, Account, Help, Settings: icon bubble, title,
// optional subtitle, and a chevron or a paw toggle on the right.
export function Row({ icon, title, subtitle, onPress, right = 'chevron', toggle }: Props) {
  const press = toggle ? () => toggle.onChange(!toggle.value) : onPress;
  return (
    <Tactile
      onPress={press}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityRole={toggle ? 'switch' : 'button'}
      accessibilityState={toggle ? { checked: toggle.value } : undefined}
      contentStyle={{ minHeight: 60, paddingLeft: 12, paddingRight: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}
    >
      {icon ? <IconBubble>{icon}</IconBubble> : null}
      <View style={{ flex: 1, gap: 1 }}>
        <Text variant="title">{title}</Text>
        {subtitle ? <Text variant="caption" color="muted" numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {toggle ? (
        <PawToggle value={toggle.value} onChange={toggle.onChange} label={title} />
      ) : right === 'chevron' ? (
        <ChevronRight size={18} color={colors.muted} strokeWidth={2.6} />
      ) : right === 'none' ? null : right}
    </Tactile>
  );
}

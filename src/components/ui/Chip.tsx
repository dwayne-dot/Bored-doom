import { Tactile } from './Tactile';
import { Text } from './Text';
import { colors } from '@/theme/colors';

type Props = { label: string; selected?: boolean; onPress?: () => void };

// Small tactile pill: filters, mood words, durations.
export function Chip({ label, selected, onPress }: Props) {
  return (
    <Tactile
      onPress={onPress}
      radius={999}
      edge={3}
      bg={selected ? colors.gold : '#28473F'}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      contentStyle={{ minHeight: 40, paddingHorizontal: 14, justifyContent: 'center' }}
    >
      <Text variant="label" color={selected ? 'ink' : 'cream'}>{label}</Text>
    </Tactile>
  );
}

import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from './Text';

// Section label + stacked children with the standard 8pt gap.
export function Section({ title, children, gap = 8 }: { title?: string; children: ReactNode; gap?: number }) {
  return (
    <View style={{ gap }}>
      {title ? <Text variant="label" color="muted" style={{ marginLeft: 8, marginTop: 6 }}>{title}</Text> : null}
      {children}
    </View>
  );
}

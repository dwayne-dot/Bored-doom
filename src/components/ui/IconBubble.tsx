import type { ReactNode } from 'react';
import { View } from 'react-native';
import { layout } from '@/theme/tokens';

// The soft circle behind every list icon (white at 8% on dark cards).
export function IconBubble({ children, size = layout.listIcon, bg = 'rgba(255,255,255,0.08)' }:
  { children: ReactNode; size?: number; bg?: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </View>
  );
}

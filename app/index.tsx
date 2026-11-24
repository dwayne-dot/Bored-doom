import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrototypeView } from '@/components/PrototypeView';
import { colors } from '@/theme/colors';

// Phase 1 home: the whole prototype, edge to edge, with real haptics.
// The prototype draws its own tab bar and handles the bottom inset itself,
// so we only pad the status bar, painted the same colour as the page under it.
export default function Home() {
  const insets = useSafeAreaInsets();
  const [top, setTop] = useState<{ color: string; dark: boolean }>({ color: colors.bg, dark: true });
  return (
    <View style={[styles.root, { paddingTop: insets.top, backgroundColor: top.color }]}>
      <StatusBar style={top.dark ? 'light' : 'dark'} />
      <PrototypeView onBackground={(color, dark) => setTop({ color, dark })} />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1 } });

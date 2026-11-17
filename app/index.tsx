import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrototypeView } from '@/components/PrototypeView';
import { colors } from '@/theme/colors';

// Phase 1 home: the whole prototype, edge to edge, with real haptics.
// The prototype draws its own tab bar and handles safe areas itself,
// so we only pad the status bar.
export default function Home() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <PrototypeView />
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.bg } });

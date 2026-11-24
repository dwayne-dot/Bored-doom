import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { colors } from '@/theme/colors';
import { haptic } from '@/lib/haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Runs the full interactive prototype inside the app.
// Every haptic the prototype asks for is forwarded to the phone's real
// haptic engine through a tiny message bridge (see prototype.html <head>).
// As native screens get built (Phase 3+), they replace this view.
type Props = {
  // The page tells us the colour behind its top edge so the status bar can match.
  onBackground?: (color: string, dark: boolean) => void;
};

export function PrototypeView({ onBackground }: Props) {
  const [uri, setUri] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  // The page draws its own floating tab bar; hand it the home-indicator inset.
  const injected = `document.documentElement.style.setProperty('--sab','${insets.bottom}px');true;`;

  useEffect(() => {
    let alive = true;
    (async () => {
      const asset = Asset.fromModule(require('../prototype/prototype.html'));
      await asset.downloadAsync();
      if (alive) setUri(asset.localUri ?? asset.uri);
    })();
    return () => { alive = false; };
  }, []);

  function onMessage(e: WebViewMessageEvent) {
    try {
      const msg = JSON.parse(e.nativeEvent.data) as { t: string; p?: number | number[]; m?: string; to?: string; c?: string; dark?: boolean };
      if (msg.t === 'haptic') haptic(msg.p);
      if (msg.t === 'error') console.warn('[prototype]', msg.m);
      if (msg.t === 'nav' && msg.to) router.push(msg.to as never);
      if (msg.t === 'bg' && msg.c) onBackground?.(msg.c, !!msg.dark);
    } catch { /* ignore */ }
  }

  if (!uri) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.amber} />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri }}
      originWhitelist={['*']}
      allowFileAccess
      allowFileAccessFromFileURLs
      allowUniversalAccessFromFileURLs
      domStorageEnabled
      javaScriptEnabled
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback
      bounces={false}
      overScrollMode="never"
      setBuiltInZoomControls={false}
      onMessage={onMessage}
      injectedJavaScriptBeforeContentLoaded={injected}
      injectedJavaScript={injected}
      style={styles.web}
      containerStyle={styles.web}
    />
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
});

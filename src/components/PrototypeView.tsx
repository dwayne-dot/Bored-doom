import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { Asset } from 'expo-asset';
import { colors } from '@/theme/colors';
import { haptic } from '@/lib/haptics';
import { router } from 'expo-router';

// Runs the full interactive prototype inside the app.
// Every haptic the prototype asks for is forwarded to the phone's real
// haptic engine through a tiny message bridge (see prototype.html <head>).
// As native screens get built (Phase 3+), they replace this view.
export function PrototypeView() {
  const [uri, setUri] = useState<string | null>(null);

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
      const msg = JSON.parse(e.nativeEvent.data) as { t: string; p?: number | number[]; m?: string; to?: string };
      if (msg.t === 'haptic') haptic(msg.p);
      if (msg.t === 'error') console.warn('[prototype]', msg.m);
      if (msg.t === 'nav' && msg.to) router.push(msg.to as never);
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
      style={styles.web}
      containerStyle={styles.web}
    />
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
});

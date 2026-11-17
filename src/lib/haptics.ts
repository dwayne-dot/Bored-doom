import * as Haptics from 'expo-haptics';
import { hapticName } from '@/theme/tokens';

type Name = (typeof hapticName)[keyof typeof hapticName];

// One place for every haptic in the app, so the feel stays consistent.
export async function hapticByName(name: Name) {
  try {
    switch (name) {
      case 'selection': return Haptics.selectionAsync();
      case 'light': return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      case 'medium': return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case 'heavy': return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      case 'success': return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      case 'warning': return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      case 'error': return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  } catch { /* haptics are a nicety, never a crash */ }
}

// Compatibility with the prototype's navigator.vibrate patterns
// (8, [10,40,10], [20,50,30] ...). Used by the WebView bridge only.
export async function haptic(pattern: number | number[] = 8) {
  if (Array.isArray(pattern)) {
    if (pattern.length >= 5) return hapticByName('success');
    const strongest = Math.max(...pattern.filter((_, i) => i % 2 === 0));
    return hapticByName(strongest >= 18 ? 'heavy' : 'medium');
  }
  if (pattern <= 4) return hapticByName('selection');
  if (pattern <= 9) return hapticByName('light');
  if (pattern <= 15) return hapticByName('medium');
  return hapticByName('heavy');
}

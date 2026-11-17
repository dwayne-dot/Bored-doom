import * as Haptics from 'expo-haptics';

// One place for every haptic in the app, so the feel stays consistent.
// The prototype sends patterns like 8, [10,40,10] or [20,50,30]; we map
// them onto iOS/Android native haptics.
export async function haptic(pattern: number | number[] = 8) {
  try {
    if (Array.isArray(pattern)) {
      const strongest = Math.max(...pattern.filter((_, i) => i % 2 === 0));
      if (pattern.length >= 5) return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (strongest >= 18) return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (pattern <= 4) return Haptics.selectionAsync();
    if (pattern <= 9) return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (pattern <= 15) return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    // Haptics are a nicety, never a crash.
  }
}

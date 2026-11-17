import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

// Custom fonts in React Native: each weight is its own font family,
// so we pick the family instead of setting fontWeight.
export const fontAssets = { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black };

export const fontFamily = {
  '600': 'Nunito_600SemiBold',
  '700': 'Nunito_700Bold',
  '800': 'Nunito_800ExtraBold',
  '900': 'Nunito_900Black',
} as const;
export type FontWeight = keyof typeof fontFamily;

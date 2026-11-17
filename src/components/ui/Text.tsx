import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { colors, type ColorName } from '@/theme/colors';
import { type } from '@/theme/tokens';
import { fontFamily, type FontWeight } from '@/theme/fonts';

export type Variant = keyof typeof type;

type Props = TextProps & {
  variant?: Variant;
  color?: ColorName;
  weight?: FontWeight; // override the variant's weight
  align?: TextStyle['textAlign'];
};

// The only text component screens should use, so type stays on the scale.
export function Text({ variant = 'body', color = 'cream', weight, align, style, ...rest }: Props) {
  const t = type[variant];
  return (
    <RNText
      maxFontSizeMultiplier={variant === 'timer' || variant === 'display' ? 1.1 : 1.3}
      style={[
        {
          fontFamily: fontFamily[(weight ?? t.weight) as FontWeight],
          fontSize: t.size,
          lineHeight: t.lineHeight,
          color: colors[color],
          textAlign: align,
          letterSpacing: 'letterSpacing' in t ? t.letterSpacing : 0,
          textTransform: variant === 'overline' ? 'uppercase' : undefined,
        },
        style,
      ]}
      {...rest}
    />
  );
}

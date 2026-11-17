import Svg, { Ellipse, G, Path, Circle } from 'react-native-svg';
import { SvgXml } from 'react-native-svg';
import { KIT, YOU_ICONS, type KitKey, type YouIconKey } from '@/icons/xml';
import { colors } from '@/theme/colors';

// Milo's paw print — the brand glyph (24×24 grid, same shape as the Insights paw).
export function PawIcon({ size = 24, color = colors.cream }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G fill={color}>
        <Path d="M12 11.6c-2.7 0-5.6 3.2-5.6 5.8 0 1.7 1.2 2.6 2.7 2.6 1.1 0 1.9-.7 2.9-.7s1.8.7 2.9.7c1.5 0 2.7-.9 2.7-2.6 0-2.6-2.9-5.8-5.6-5.8z" />
        <Ellipse cx={4.5} cy={9.7} rx={1.8} ry={2.3} />
        <Ellipse cx={8.9} cy={5.3} rx={1.9} ry={2.5} />
        <Ellipse cx={15.1} cy={5.3} rx={1.9} ry={2.5} />
        <Ellipse cx={19.5} cy={9.7} rx={1.8} ry={2.3} />
      </G>
    </Svg>
  );
}

// Toolkit icons (Finch-style, from Figma).
export function KitIcon({ name, size = 28 }: { name: KitKey; size?: number }) {
  return <SvgXml xml={KIT[name].xml} width={size} height={size} />;
}

// You-screen list icons (flat, optically matched).
export function YouIcon({ name, size = 24 }: { name: YouIconKey; size?: number }) {
  return <SvgXml xml={YOU_ICONS[name]} width={size} height={size} />;
}

// Locked In lock: half-circle body, keyhole with clearance. Shackle swings open.
export function LockIcon({ size = 24, open = false, color = colors.gold }: { size?: number; open?: boolean; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
      <G transform={open ? 'translate(0 -1.6) rotate(-24 7.8 10.4)' : undefined}>
        <Path d="M7.8 10.4V6.9a4.2 4.2 0 0 1 8.4 0v3.5" />
      </G>
      <Path d="M4.2 10.4h15.6v3a7.8 7.8 0 0 1-15.6 0z" fill={color} fillOpacity={0.14} />
      <Circle cx={12} cy={14.6} r={1.25} fill={color} stroke="none" />
      <Path d="M12 15.3v1.7" strokeWidth={1.8} />
    </Svg>
  );
}

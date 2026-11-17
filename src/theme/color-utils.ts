// Small colour helpers used to derive the "tactile" bottom edge of a surface.
export function shade(hex: string, amount: number): string {
  // amount < 0 darkens, > 0 lightens (−1…1)
  const n = parseInt(hex.replace('#', ''), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount),
  );
  return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('');
}

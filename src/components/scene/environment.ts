// Time-of-day looks for Milo's room. The scene glides between these over
// about a second, so switching Day -> Sunset -> Night feels like the light
// is really changing.
import { Color, Vector3 } from 'three';
import type { TimeOfDay } from './bridge';

type Preset = {
  ambient: string; ambientI: number;
  hemiSky: string; hemiGround: string; hemiI: number;
  sun: string; sunI: number; sunPos: [number, number, number];
  skyTop: string; skyBottom: string;
  disc: string; discPos: [number, number]; discO: number;   // sun or moon in the window
  starsO: number;
  lampI: number; lampGlow: number;
  clear: string;
};

export const PRESETS: Record<TimeOfDay, Preset> = {
  day: {
    ambient: '#FFF4E6', ambientI: 1.05,
    hemiSky: '#D6ECFF', hemiGround: '#C9A27A', hemiI: 1.15,
    sun: '#FFF1D6', sunI: 2.3, sunPos: [2.5, 5, -4],
    skyTop: '#8FD0F5', skyBottom: '#D8F1FF',
    disc: '#FFE27A', discPos: [0.45, 0.32], discO: 1,
    starsO: 0,
    lampI: 0, lampGlow: 0,
    clear: '#F2DCC2',
  },
  sunset: {
    ambient: '#FFD3AE', ambientI: 0.8,
    hemiSky: '#FFB38A', hemiGround: '#7A4E3A', hemiI: 0.9,
    sun: '#FF9A55', sunI: 2.0, sunPos: [-3, 1.6, -4],
    skyTop: '#7E6BB8', skyBottom: '#FFB36B',
    disc: '#FF8A3D', discPos: [-0.35, -0.2], discO: 1,
    starsO: 0.15,
    lampI: 1.5, lampGlow: 0.35,
    clear: '#C98B6B',
  },
  night: {
    ambient: '#7A8CC7', ambientI: 0.38,
    hemiSky: '#2A3C6B', hemiGround: '#1A1410', hemiI: 0.5,
    sun: '#9DB4FF', sunI: 0.6, sunPos: [3, 4, -4],
    skyTop: '#0B1430', skyBottom: '#22305A',
    disc: '#F4F1E1', discPos: [0.35, 0.3], discO: 1,
    starsO: 1,
    lampI: 5, lampGlow: 1,
    clear: '#1B2233',
  },
};

// The live, blended values every part of the room reads each frame.
export type Env = {
  ambient: Color; ambientI: number;
  hemiSky: Color; hemiGround: Color; hemiI: number;
  sun: Color; sunI: number; sunPos: Vector3;
  skyTop: Color; skyBottom: Color;
  disc: Color; discPos: Vector3; discO: number;
  starsO: number;
  lampI: number; lampGlow: number;
  clear: Color;
};

export function createEnv(tod: TimeOfDay): Env {
  const p = PRESETS[tod];
  return {
    ambient: new Color(p.ambient), ambientI: p.ambientI,
    hemiSky: new Color(p.hemiSky), hemiGround: new Color(p.hemiGround), hemiI: p.hemiI,
    sun: new Color(p.sun), sunI: p.sunI, sunPos: new Vector3(...p.sunPos),
    skyTop: new Color(p.skyTop), skyBottom: new Color(p.skyBottom),
    disc: new Color(p.disc), discPos: new Vector3(p.discPos[0], p.discPos[1], 0), discO: p.discO,
    starsO: p.starsO,
    lampI: p.lampI, lampGlow: p.lampGlow,
    clear: new Color(p.clear),
  };
}

const tmp = new Color();
const tmpV = new Vector3();
// Move the live values a step toward the chosen time of day.
export function blendEnv(env: Env, tod: TimeOfDay, dt: number) {
  const p = PRESETS[tod];
  const k = 1 - Math.exp(-dt * 3.2);             // ~1 s glide, frame-rate independent
  const c = (target: Color, hex: string) => target.lerp(tmp.set(hex), k);
  const n = (a: number, b: number) => a + (b - a) * k;
  c(env.ambient, p.ambient); env.ambientI = n(env.ambientI, p.ambientI);
  c(env.hemiSky, p.hemiSky); c(env.hemiGround, p.hemiGround); env.hemiI = n(env.hemiI, p.hemiI);
  c(env.sun, p.sun); env.sunI = n(env.sunI, p.sunI); env.sunPos.lerp(tmpV.set(...p.sunPos), k);
  c(env.skyTop, p.skyTop); c(env.skyBottom, p.skyBottom);
  c(env.disc, p.disc); env.discPos.lerp(tmpV.set(p.discPos[0], p.discPos[1], 0), k); env.discO = n(env.discO, p.discO);
  env.starsO = n(env.starsO, p.starsO);
  env.lampI = n(env.lampI, p.lampI); env.lampGlow = n(env.lampGlow, p.lampGlow);
  c(env.clear, p.clear);
}

// Sensible starting look from the phone's clock.
export function timeOfDayNow(d = new Date()): TimeOfDay {
  const h = d.getHours();
  if (h >= 7 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'sunset';
  return 'night';
}

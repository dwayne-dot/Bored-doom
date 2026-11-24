// The shared state between the 3D room (Three.js) and Milo (a normal
// React Native view floating above it). The 3D side writes positions every
// frame; the screen reads them to place Milo, aim his eyes and react.
// Plain mutable objects on purpose: they change 60 times a second and
// must not trigger React renders.
import { Vector3 } from 'three';

export type TimeOfDay = 'day' | 'sunset' | 'night';

export type RoomEvent =
  | { type: 'throw'; speed: number }
  | { type: 'bounce'; impact: number }
  | { type: 'settle'; nearMilo: boolean }
  | { type: 'fetch' };

export type BurstKind = 'hearts' | 'sparkles';

// Room layout, in metres. The floor is y = 0, the back wall z = -3.
export const ROOM = {
  halfWidth: 1.9,
  back: -3,
  // The ball always stays behind Milo, so the Milo view (drawn on top of
  // the 3D canvas) never wrongly covers a ball that should be in front.
  front: 1.15,
  milo: new Vector3(0, 0, 1.55),  // where Milo's paws touch the floor
  ballHome: new Vector3(0.72, 0.12, 0.55),
  ballRadius: 0.12,
} as const;

export type Bridge = {
  ball: {
    pos: Vector3;
    vel: Vector3;
    spin: Vector3;
    resting: boolean;
    restSince: number;
    screen: { x: number; y: number; r: number };
  };
  milo: { screen: { x: number; y: number; pxPerMetre: number } };
  camera: { tiltTarget: { x: number; y: number }; drag: { x: number; y: number } };
  pending: {
    impulse: Vector3 | null;               // set by a throw, consumed by the ball
    bursts: { kind: BurstKind; at: Vector3; count: number }[];
  };
  time: number;                              // 3D clock, seconds
  reduceMotion: boolean;
  listeners: Set<(e: RoomEvent) => void>;
  emit: (e: RoomEvent) => void;
  onFrame: ((b: Bridge) => void) | null;  // screen hook, runs after each 3D frame
};

export function createBridge(): Bridge {
  const listeners = new Set<(e: RoomEvent) => void>();
  return {
    ball: {
      pos: ROOM.ballHome.clone(),
      vel: new Vector3(),
      spin: new Vector3(),
      resting: true,
      restSince: 0,
      screen: { x: -999, y: -999, r: 0 },
    },
    milo: { screen: { x: 0, y: 0, pxPerMetre: 0 } },
    camera: { tiltTarget: { x: 0, y: 0 }, drag: { x: 0, y: 0 } },
    pending: { impulse: null, bursts: [] },
    time: 0,
    reduceMotion: false,
    listeners,
    emit: (e) => listeners.forEach((l) => l(e)),
    onFrame: null,
  };
}

// Swipe on screen (points per second) -> throw velocity in the room.
// Up the screen = into the room. Faster swipes = higher, longer throws.
export function throwFromSwipe(b: Bridge, vx: number, vy: number, width: number, height: number) {
  const sx = vx / width, sy = vy / height;          // screens per second
  const speed = Math.min(3, Math.hypot(sx, sy));
  const v = new Vector3(
    Math.max(-4, Math.min(4, sx * 2.4)),
    2.2 + speed * 1.9,
    Math.max(-7, Math.min(1.5, sy * 3.6)),
  );
  b.pending.impulse = v;
  b.emit({ type: 'throw', speed });
}

// Tap on the ball: a little pop straight up.
export function popBall(b: Bridge) {
  b.pending.impulse = new Vector3((Math.random() - 0.5) * 0.8, 3.6, -0.6 - Math.random() * 0.6);
  b.emit({ type: 'throw', speed: 0.4 });
}

export function burst(b: Bridge, kind: BurstKind, at: Vector3, count = 10) {
  if (b.reduceMotion) count = Math.min(count, 3);
  b.pending.bursts.push({ kind, at: at.clone(), count });
}

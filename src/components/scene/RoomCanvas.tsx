// The 3D room canvas. Sits behind Milo (absolute, full screen) and keeps
// the bridge up to date: where the ball and Milo's paws are on screen.
import { useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Vector3, type PerspectiveCamera } from 'three';
import { Canvas, useFrame, useThree } from './r3f';
import { ROOM, type Bridge, type TimeOfDay } from './bridge';
import { blendEnv, createEnv, type Env } from './environment';
import { RoomSet } from './RoomSet';
import { Ball } from './Ball';
import { Particles } from './Particles';

export const CAMERA = { pos: new Vector3(0, 2.35, 5.4), target: new Vector3(0, 0.8, -0.8), fov: 54 };

type Props = { bridge: Bridge; timeOfDay: TimeOfDay };

export function RoomCanvas({ bridge, timeOfDay }: Props) {
  const env = useMemo(() => createEnv(timeOfDay), []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Canvas
      style={StyleSheet.absoluteFill}
      camera={{ position: CAMERA.pos.toArray(), fov: CAMERA.fov, near: 0.1, far: 40 }}
      gl={{ antialias: true }}
    >
      <EnvBlender env={env} timeOfDay={timeOfDay} />
      <CameraRig bridge={bridge} />
      <RoomSet env={env} />
      <Ball bridge={bridge} />
      <Particles bridge={bridge} />
      <Projector bridge={bridge} />
    </Canvas>
  );
}

function EnvBlender({ env, timeOfDay }: { env: Env; timeOfDay: TimeOfDay }) {
  useFrame((_, delta) => blendEnv(env, timeOfDay, Math.min(delta, 0.1)));
  return null;
}

// Parallax: the camera drifts with phone tilt (or a finger drag) while
// always looking at the same spot, so the room feels deep and real.
function CameraRig({ bridge }: { bridge: Bridge }) {
  const camera = useThree((s) => s.camera);
  const cur = useRef({ x: 0, y: 0 });
  useFrame((_, delta) => {
    const t = bridge.camera.tiltTarget, d = bridge.camera.drag;
    const tx = bridge.reduceMotion ? 0 : Math.max(-1, Math.min(1, t.x + d.x));
    const ty = bridge.reduceMotion ? 0 : Math.max(-1, Math.min(1, t.y + d.y));
    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 5);
    cur.current.x += (tx - cur.current.x) * k;
    cur.current.y += (ty - cur.current.y) * k;
    camera.position.set(
      CAMERA.pos.x + cur.current.x * 0.75,
      CAMERA.pos.y + cur.current.y * 0.4,
      CAMERA.pos.z - Math.abs(cur.current.x) * 0.15,
    );
    camera.lookAt(CAMERA.target);
  });
  return null;
}

const v = new Vector3();
const v2 = new Vector3();
// World -> screen points (React Native points, origin top-left).
function Projector({ bridge }: { bridge: Bridge }) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  useFrame((state) => {
    bridge.time = state.clock.elapsedTime;
    const toScreen = (p: Vector3, out: { x: number; y: number }) => {
      v.copy(p).project(camera);
      out.x = (v.x + 1) / 2 * size.width;
      out.y = (1 - v.y) / 2 * size.height;
    };
    const b = bridge.ball;
    toScreen(b.pos, b.screen);
    v2.copy(b.pos).y += ROOM.ballRadius;
    const top = { x: 0, y: 0 };
    toScreen(v2, top);
    b.screen.r = Math.abs(b.screen.y - top.y);

    const m = bridge.milo.screen;
    toScreen(ROOM.milo, m);
    v2.copy(ROOM.milo).y += 1;
    toScreen(v2, top);
    m.pxPerMetre = Math.abs(m.y - top.y);
    bridge.onFrame?.(bridge);
  });
  return null;
}

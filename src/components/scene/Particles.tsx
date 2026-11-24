// Floating 3D hearts and sparkles. A fixed pool of meshes is reused, so
// bursts never allocate during play. Bursts are queued on bridge.pending.
import { useMemo, useRef } from 'react';
import { ExtrudeGeometry, Mesh, MeshLambertMaterial, OctahedronGeometry, Shape, Vector3 } from 'three';
import { useFrame, useThree } from './r3f';
import type { Bridge, BurstKind } from './bridge';

const POOL = 36;
const LIFE = 1.25;

type P = { alive: boolean; kind: BurstKind; t: number; vel: Vector3; size: number; wobble: number };

function heartGeometry() {
  const s = new Shape();
  s.moveTo(0, -0.5);
  s.bezierCurveTo(-0.15, -0.35, -0.6, -0.05, -0.6, 0.22);
  s.bezierCurveTo(-0.6, 0.5, -0.32, 0.62, -0.15, 0.55);
  s.bezierCurveTo(-0.06, 0.52, 0, 0.44, 0, 0.36);
  s.bezierCurveTo(0, 0.44, 0.06, 0.52, 0.15, 0.55);
  s.bezierCurveTo(0.32, 0.62, 0.6, 0.5, 0.6, 0.22);
  s.bezierCurveTo(0.6, -0.05, 0.15, -0.35, 0, -0.5);
  const g = new ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 2, curveSegments: 10 });
  g.center();
  return g;
}

export function Particles({ bridge }: { bridge: Bridge }) {
  const camera = useThree((s) => s.camera);
  const heart = useMemo(heartGeometry, []);
  const spark = useMemo(() => new OctahedronGeometry(0.5, 0), []);
  const meshes = useRef<(Mesh | null)[]>([]);
  const state = useMemo<P[]>(
    () => Array.from({ length: POOL }, () => ({ alive: false, kind: 'hearts', t: 0, vel: new Vector3(), size: 0.1, wobble: 0 })),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    // spawn queued bursts
    for (const b of bridge.pending.bursts.splice(0)) {
      for (let n = 0; n < b.count; n++) {
        const i = state.findIndex((p) => !p.alive);
        if (i < 0) break;
        const p = state[i];
        const m = meshes.current[i];
        if (!m) continue;
        const heartish = b.kind === 'hearts' ? n % 3 !== 2 : n % 4 === 0; // mix a few of each
        p.alive = true; p.t = 0; p.kind = heartish ? 'hearts' : 'sparkles';
        const a = Math.random() * Math.PI * 2;
        const sp = 0.5 + Math.random() * 0.9;
        p.vel.set(Math.cos(a) * sp * 0.8, 0.9 + Math.random() * 1.1, Math.sin(a) * sp * 0.3);
        p.size = p.kind === 'hearts' ? 0.09 + Math.random() * 0.06 : 0.05 + Math.random() * 0.04;
        p.wobble = Math.random() * 6;
        m.geometry = p.kind === 'hearts' ? heart : spark;
        (m.material as MeshLambertMaterial).color.set(p.kind === 'hearts' ? (n % 2 ? '#E9958A' : '#E5604D') : '#F2CC6B');
        (m.material as MeshLambertMaterial).emissive.set(p.kind === 'hearts' ? '#7A1F1A' : '#8A6A10');
        m.position.copy(b.at).add(new Vector3((Math.random() - 0.5) * 0.3, Math.random() * 0.15, 0));
        m.visible = true;
      }
    }
    // move, float, fade
    state.forEach((p, i) => {
      const m = meshes.current[i];
      if (!m || !p.alive) return;
      p.t += dt;
      const k = p.t / LIFE;
      if (k >= 1) { p.alive = false; m.visible = false; return; }
      p.vel.y += 0.35 * dt;                         // hearts drift upward
      p.vel.multiplyScalar(Math.exp(-dt * 1.4));
      m.position.addScaledVector(p.vel, dt);
      const pop = k < 0.15 ? k / 0.15 : 1 - Math.pow((k - 0.15) / 0.85, 2);
      m.scale.setScalar(p.size * Math.max(0.01, pop));
      if (p.kind === 'hearts') {
        m.quaternion.copy(camera.quaternion);        // face the camera
        m.rotateZ(Math.sin(p.t * 5 + p.wobble) * 0.35);
      } else {
        m.rotation.x += dt * 4; m.rotation.y += dt * 5;
      }
      (m.material as MeshLambertMaterial).opacity = Math.min(1, 1.6 - k * 1.6);
    });
  });

  return (
    <group>
      {state.map((_, i) => (
        <mesh key={i} ref={(m) => { meshes.current[i] = m; }} visible={false} geometry={heart}>
          <meshLambertMaterial transparent emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

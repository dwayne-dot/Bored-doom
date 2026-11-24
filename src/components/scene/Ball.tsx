// The tennis ball: gravity, bouncy floor, walls, rolling friction and spin.
// Throws come in through bridge.pending.impulse (from a swipe or tap).
import { useRef } from 'react';
import { Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { useFrame } from './r3f';
import { ROOM, type Bridge } from './bridge';

const G = 9.8;
const R = ROOM.ballRadius;
const tmp = new Vector3();

export function Ball({ bridge }: { bridge: Bridge }) {
  const ball = useRef<Mesh>(null);
  const shadow = useRef<Group>(null);
  const lastBounce = useRef(0);

  useFrame((state, delta) => {
    const b = bridge.ball;
    const now = state.clock.elapsedTime;
    const imp = bridge.pending.impulse;
    if (imp) {
      b.vel.copy(imp);
      b.spin.set(imp.z * 6, 0, -imp.x * 6);
      b.resting = false;
      bridge.pending.impulse = null;
    }

    if (!b.resting) {
      // Two sub-steps keep fast throws from tunnelling through walls.
      const steps = 2;
      const dt = Math.min(delta, 1 / 30) / steps;
      for (let s = 0; s < steps; s++) {
        b.vel.y -= G * dt;
        b.pos.addScaledVector(b.vel, dt);

        if (b.pos.y <= R) {
          b.pos.y = R;
          const impact = -b.vel.y;
          if (impact > 0.7) {
            b.vel.y = impact * 0.62;
            b.vel.x *= 0.9; b.vel.z *= 0.9;
            if (now - lastBounce.current > 0.08) { lastBounce.current = now; bridge.emit({ type: 'bounce', impact }); }
          } else {
            b.vel.y = 0;
            const f = Math.exp(-dt * 1.7);       // rolling friction
            b.vel.x *= f; b.vel.z *= f;
            b.spin.set(b.vel.z / R, 0, -b.vel.x / R);
          }
        }
        const xMax = ROOM.halfWidth - R;
        if (b.pos.x > xMax) { b.pos.x = xMax; b.vel.x = -Math.abs(b.vel.x) * 0.7; }
        if (b.pos.x < -xMax) { b.pos.x = -xMax; b.vel.x = Math.abs(b.vel.x) * 0.7; }
        if (b.pos.z < ROOM.back + R) { b.pos.z = ROOM.back + R; b.vel.z = Math.abs(b.vel.z) * 0.7; }
        if (b.pos.z > ROOM.front) { b.pos.z = ROOM.front; b.vel.z = -Math.abs(b.vel.z) * 0.5; }
      }
      if (b.pos.y <= R + 0.001 && Math.hypot(b.vel.x, b.vel.z) < 0.05 && Math.abs(b.vel.y) < 0.01) {
        b.vel.set(0, 0, 0);
        b.resting = true;
        b.restSince = now;
        const near = tmp.set(b.pos.x - ROOM.milo.x, 0, b.pos.z - ROOM.milo.z).length() < 1.0;
        bridge.emit({ type: 'settle', nearMilo: near });
      }
    }

    if (ball.current) {
      ball.current.position.copy(b.pos);
      const dt = Math.min(delta, 1 / 30);
      ball.current.rotation.x += b.spin.x * dt;
      ball.current.rotation.z += b.spin.z * dt;
      if (b.resting) b.spin.multiplyScalar(0.9);
    }
    if (shadow.current) {
      const h = b.pos.y - R;
      const k = Math.max(0.35, 1 - h * 0.35);
      shadow.current.position.set(b.pos.x, 0.022, b.pos.z);
      shadow.current.scale.set(k, k, 1);
      shadow.current.children.forEach((c) => {
        const m = (c as Mesh).material as MeshBasicMaterial;
        m.opacity = 0.1 * k;
      });
    }
  });

  return (
    <group>
      <group ref={shadow} rotation={[-Math.PI / 2, 0, 0]}>
        {[1.6, 1.25, 0.95].map((k, i) => (
          <mesh key={i} position={[0, 0, i * 0.001]}>
            <circleGeometry args={[R * k, 24]} />
            <meshBasicMaterial color="#2A1A10" transparent opacity={0.1} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <mesh ref={ball}>
        <sphereGeometry args={[R, 24, 16]} />
        <meshLambertMaterial color="#D4E157" />
        {/* the white seam */}
        <mesh rotation={[0.5, 0.3, 0]}>
          <torusGeometry args={[R * 1.0, R * 0.08, 6, 36]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
      </mesh>
    </group>
  );
}

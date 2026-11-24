// Milo's room: floor, walls, window with a live sky, dog bed, rug, plant,
// lamp, a little paw-print picture, and the lights. Low-poly and matte so
// it stays cozy, matches the flat illustrations, and runs at 60 fps.
import { useMemo, useRef } from 'react';
import {
  AdditiveBlending, AmbientLight, BufferAttribute, Color, DirectionalLight, HemisphereLight,
  Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry, PointLight, PointsMaterial,
} from 'three';
import { useFrame, useThree } from './r3f';
import { ROOM } from './bridge';
import type { Env } from './environment';

const WALL = '#F2DCC2';
const WALL_SIDE = '#EAD0B2';
const WAINSCOT = '#E2BC93';
const FLOOR = '#C98F5A';
const WOOD = '#8A5A3A';
const TEAL = '#2E6B5E';

const BACK = ROOM.back;
const HW = ROOM.halfWidth;
const WALL_H = 4.6;
const WIN = { x: 0.62, y: 2.05, w: 1.25, h: 1.15 };

export function RoomSet({ env }: { env: Env }) {
  const ambient = useRef<AmbientLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const lamp = useRef<PointLight>(null);
  const shade = useRef<MeshLambertMaterial>(null);
  const beam = useRef<MeshBasicMaterial>(null);
  const disc = useRef<Mesh>(null);
  const discMat = useRef<MeshBasicMaterial>(null);
  const starsMat = useRef<PointsMaterial>(null);
  const gl = useThree((s) => s.gl);

  // Window sky: a plane whose top and bottom vertices carry the sky colours.
  const sky = useMemo(() => {
    const g = new PlaneGeometry(WIN.w, WIN.h, 1, 1);
    g.setAttribute('color', new BufferAttribute(new Float32Array(4 * 3), 3));
    return g;
  }, []);
  const stars = useMemo(() => {
    const pts = new Float32Array(26 * 3);
    for (let i = 0; i < 26; i++) {
      pts[i * 3] = (Math.random() - 0.5) * WIN.w * 0.9;
      pts[i * 3 + 1] = (Math.random() - 0.2) * WIN.h * 0.45;
      pts[i * 3 + 2] = 0.002;
    }
    return pts;
  }, []);

  useFrame(() => {
    gl.setClearColor(env.clear);
    if (ambient.current) { ambient.current.color.copy(env.ambient); ambient.current.intensity = env.ambientI; }
    if (hemi.current) { hemi.current.color.copy(env.hemiSky); hemi.current.groundColor.copy(env.hemiGround); hemi.current.intensity = env.hemiI; }
    if (sun.current) { sun.current.color.copy(env.sun); sun.current.intensity = env.sunI; sun.current.position.copy(env.sunPos); }
    if (lamp.current) lamp.current.intensity = env.lampI;
    if (shade.current) shade.current.emissiveIntensity = env.lampGlow;
    if (beam.current) { beam.current.color.copy(env.sun); beam.current.opacity = Math.max(0, env.sunI - 1) * 0.12; }
    const col = sky.getAttribute('color') as BufferAttribute;
    // PlaneGeometry vertex order: top-left, top-right, bottom-left, bottom-right
    col.setXYZ(0, env.skyTop.r, env.skyTop.g, env.skyTop.b);
    col.setXYZ(1, env.skyTop.r, env.skyTop.g, env.skyTop.b);
    col.setXYZ(2, env.skyBottom.r, env.skyBottom.g, env.skyBottom.b);
    col.setXYZ(3, env.skyBottom.r, env.skyBottom.g, env.skyBottom.b);
    col.needsUpdate = true;
    if (disc.current) disc.current.position.set(env.discPos.x * WIN.w * 0.5, env.discPos.y * WIN.h * 0.5, 0.004);
    if (discMat.current) { discMat.current.color.copy(env.disc); discMat.current.opacity = env.discO; }
    if (starsMat.current) starsMat.current.opacity = env.starsO;
  });

  return (
    <group>
      <ambientLight ref={ambient} />
      <hemisphereLight ref={hemi} />
      <directionalLight ref={sun} />
      <pointLight ref={lamp} position={[1.3, 1.55, -1.95]} color="#FFC27A" distance={6} decay={1.6} />

      {/* Floor + planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, (BACK + 3) / 2]}>
        <planeGeometry args={[HW * 2, 3 - BACK]} />
        <meshLambertMaterial color={FLOOR} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => -HW + (i + 1) * (HW * 2) / 10).map((x) => (
        <mesh key={x} position={[x, 0.002, (BACK + 3) / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.018, 3 - BACK]} />
          <meshBasicMaterial color="#A86F42" transparent opacity={0.55} />
        </mesh>
      ))}
      {/* Sunlight patch from the window */}
      <mesh rotation={[-Math.PI / 2, 0, 0.18]} position={[0.42, 0.004, -2.05]}>
        <planeGeometry args={[1.0, 1.4]} />
        <meshBasicMaterial ref={beam} transparent opacity={0.15} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, WALL_H / 2, BACK]}>
        <planeGeometry args={[HW * 2, WALL_H]} />
        <meshLambertMaterial color={WALL} />
      </mesh>
      <mesh position={[0, 0.45, BACK + 0.01]}>
        <planeGeometry args={[HW * 2, 0.9]} />
        <meshLambertMaterial color={WAINSCOT} />
      </mesh>
      <mesh position={[0, 0.92, BACK + 0.03]}>
        <boxGeometry args={[HW * 2, 0.05, 0.05]} />
        <meshLambertMaterial color="#FFF6EA" />
      </mesh>
      <mesh position={[-HW, WALL_H / 2, (BACK + 3) / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[3 - BACK, WALL_H]} />
        <meshLambertMaterial color={WALL_SIDE} />
      </mesh>
      <mesh position={[HW, WALL_H / 2, (BACK + 3) / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[3 - BACK, WALL_H]} />
        <meshLambertMaterial color={WALL_SIDE} />
      </mesh>

      {/* Window: live sky, sun/moon, stars, wooden frame */}
      <group position={[WIN.x, WIN.y, BACK + 0.015]}>
        <mesh geometry={sky}>
          <meshBasicMaterial vertexColors />
        </mesh>
        <mesh ref={disc}>
          <circleGeometry args={[0.15, 28]} />
          <meshBasicMaterial ref={discMat} transparent />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[stars, 3]} />
          </bufferGeometry>
          <pointsMaterial ref={starsMat} color="#FFFFFF" size={0.035} transparent opacity={0} />
        </points>
        {[
          [0, WIN.h / 2 + 0.04, WIN.w + 0.16, 0.08], [0, -WIN.h / 2 - 0.04, WIN.w + 0.16, 0.08],
          [-WIN.w / 2 - 0.04, 0, 0.08, WIN.h], [WIN.w / 2 + 0.04, 0, 0.08, WIN.h],
          [0, 0, 0.045, WIN.h], [0, 0.05, WIN.w, 0.045],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, 0.03]}>
            <boxGeometry args={[w, h, 0.06]} />
            <meshLambertMaterial color={WOOD} />
          </mesh>
        ))}
        <mesh position={[0, -WIN.h / 2 - 0.1, 0.08]}>
          <boxGeometry args={[WIN.w + 0.3, 0.06, 0.2]} />
          <meshLambertMaterial color="#F7EBDD" />
        </mesh>
      </group>

      {/* Paw-print picture */}
      <group position={[-0.85, 2.05, BACK + 0.03]}>
        <mesh><boxGeometry args={[0.72, 0.58, 0.04]} /><meshLambertMaterial color={WOOD} /></mesh>
        <mesh position={[0, 0, 0.025]}><planeGeometry args={[0.6, 0.46]} /><meshLambertMaterial color="#BFE3D3" /></mesh>
        <mesh position={[0, -0.05, 0.03]}><circleGeometry args={[0.09, 20]} /><meshBasicMaterial color="#E88D4F" /></mesh>
        {[[-0.11, 0.05], [-0.04, 0.11], [0.04, 0.11], [0.11, 0.05]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.03]}><circleGeometry args={[0.035, 14]} /><meshBasicMaterial color="#E88D4F" /></mesh>
        ))}
      </group>

      {/* Rug */}
      <mesh position={[0, 0.006, 0.55]} scale={[1, 1, 0.55]}>
        <cylinderGeometry args={[1.45, 1.45, 0.012, 40]} />
        <meshLambertMaterial color="#E9A27C" />
      </mesh>
      <mesh position={[0, 0.013, 0.55]} scale={[1, 1, 0.55]}>
        <cylinderGeometry args={[1.12, 1.12, 0.004, 40]} />
        <meshLambertMaterial color="#F6CBA2" />
      </mesh>

      {/* Dog bed */}
      <group position={[-0.9, 0, -1.7]} scale={[0.85, 0.85, 0.66]}>
        <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.72, 0.76, 0.14, 32]} /><meshLambertMaterial color={TEAL} /></mesh>
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.6, 0.16, 12, 32]} /><meshLambertMaterial color="#3B8172" /></mesh>
        <mesh position={[0, 0.16, 0]}><cylinderGeometry args={[0.5, 0.5, 0.08, 28]} /><meshLambertMaterial color="#F3E3CC" /></mesh>
        <mesh position={[0.18, 0.22, 0.12]} rotation={[0, 0.4, 0]}><boxGeometry args={[0.16, 0.05, 0.42]} /><meshLambertMaterial color="#F2B23A" /></mesh>
      </group>

      {/* Plant */}
      <group position={[-1.45, 0, -2.5]}>
        <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.2, 0.15, 0.4, 16]} /><meshLambertMaterial color="#C65A2E" /></mesh>
        {[[0, 0.62, 0, 0.26], [-0.14, 0.52, 0.06, 0.18], [0.15, 0.55, -0.02, 0.2], [0.02, 0.82, 0.02, 0.16]].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}><icosahedronGeometry args={[r, 0]} /><meshLambertMaterial color={i % 2 ? '#6CC3A0' : '#4FA884'} /></mesh>
        ))}
      </group>

      {/* Floor lamp (glows at night) */}
      <group position={[1.4, 0, -2.2]}>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.18, 0.2, 0.04, 16]} /><meshLambertMaterial color="#3A2E2A" /></mesh>
        <mesh position={[0, 0.75, 0]}><cylinderGeometry args={[0.02, 0.02, 1.5, 8]} /><meshLambertMaterial color="#3A2E2A" /></mesh>
        <mesh position={[0, 1.62, 0]}>
          <cylinderGeometry args={[0.16, 0.28, 0.32, 20, 1, true]} />
          <meshLambertMaterial ref={shade} color="#F6D9A8" emissive={new Color('#FFB866')} emissiveIntensity={0} side={2} />
        </mesh>
      </group>

      {/* Soft shadow where Milo stands (he's a 2D view drawn above the room) */}
      <BlobShadow x={ROOM.milo.x} z={ROOM.milo.z - 0.05} r={0.62} squash={0.42} opacity={0.26} />
    </group>
  );
}

// A soft round shadow: a few stacked translucent discs fake a blurred edge.
export function BlobShadow({ x, z, r, squash = 1, opacity = 0.25, meshRef }: {
  x: number; z: number; r: number; squash?: number; opacity?: number; meshRef?: React.Ref<import('three').Group>;
}) {
  return (
    <group ref={meshRef} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, squash, 1]}>
      {[1, 0.78, 0.55].map((k, i) => (
        <mesh key={i} position={[0, 0, i * 0.001]}>
          <circleGeometry args={[r * k, 32]} />
          <meshBasicMaterial color="#2A1A10" transparent opacity={opacity / 3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

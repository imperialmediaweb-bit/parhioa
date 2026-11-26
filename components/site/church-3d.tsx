'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ── Palette (warm Orthodox) ───────────────────────────────────────────── */
const WALL = '#efe4cd';
const WALL_SHADE = '#e4d4b4';
const ROOF = '#5b6b7c';
const ROOF_DARK = '#48566a';
const GOLD = '#c9a361';
const GOLD_HI = '#e7c987';
const WOOD = '#5b3a22';
const GLASS = '#9fb8d8';
const STONE = '#cdbd98';

/**
 * One church part. When `built`, shows solid material; otherwise a faint,
 * translucent "ghost" of the finished shape (NOT wireframe) so the building
 * reads as rising, cleanly.
 */
function Part({
  built,
  color,
  metalness = 0,
  roughness = 0.92,
  ghostColor = WALL_SHADE,
  children,
  ...props
}: any) {
  return (
    <mesh castShadow receiveShadow {...props}>
      {children}
      {built ? (
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      ) : (
        <meshStandardMaterial
          color={ghostColor}
          transparent
          opacity={0.1}
          depthWrite={false}
          roughness={1}
        />
      )}
    </mesh>
  );
}

/** Onion-dome lathe profile — the signature Orthodox cupola. */
function onionGeometry(scale = 1) {
  const pts = [
    [0.0, 0.0],
    [0.5, 0.05],
    [0.64, 0.3],
    [0.52, 0.58],
    [0.26, 0.82],
    [0.1, 0.98],
    [0.0, 1.08],
  ].map(([x, y]) => new THREE.Vector2(x * scale, y * scale));
  return new THREE.LatheGeometry(pts, 56);
}

/** A gilded 3-bar Orthodox cross. */
function Cross({ built, y = 0, s = 1 }: { built: boolean; y?: number; s?: number }) {
  const gold = { color: GOLD_HI, metalness: 0.8, roughness: 0.18, ghostColor: GOLD };
  return (
    <group position={[0, y, 0]} scale={s}>
      <Part built={built} {...gold} position={[0, 0.34, 0]}>
        <boxGeometry args={[0.055, 0.9, 0.055]} />
      </Part>
      <Part built={built} {...gold} position={[0, 0.52, 0]}>
        <boxGeometry args={[0.42, 0.06, 0.055]} />
      </Part>
      <Part built={built} {...gold} position={[0, 0.66, 0]}>
        <boxGeometry args={[0.24, 0.05, 0.05]} />
      </Part>
      {/* slanted foot-bar */}
      <Part built={built} {...gold} position={[0, 0.14, 0]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.26, 0.05, 0.05]} />
      </Part>
    </group>
  );
}

function Church({ percent }: { percent: number }) {
  const g = useRef<THREE.Group>(null);
  const p = Math.max(0, Math.min(100, percent));
  const built = (at: number) => p >= at;

  const dome = useMemo(() => onionGeometry(1), []);
  const domeMid = useMemo(() => onionGeometry(0.62), []);
  const domeSmall = useMemo(() => onionGeometry(0.42), []);

  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.22;
  });

  // Stage thresholds (match the chips: Temelie/Ziduri/Acoperiș/Turlă/Cruce)
  const FOUND = 8, WALLS = 30, ROOFS = 55, TOWER = 75, CROSS = 95;

  return (
    <group ref={g} position={[0, -1.1, 0]}>
      {/* ground platform (always present) */}
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[3.6, 3.8, 0.22, 56]} />
        <meshStandardMaterial color={STONE} roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0, 0.02, 0]}>
        <boxGeometry args={[4.0, 0.12, 2.6]} />
        <meshStandardMaterial color="#d7c7a3" roughness={1} />
      </mesh>

      {/* foundation */}
      <Part built={built(FOUND)} color={WALL_SHADE} position={[0, 0.28, 0]}>
        <boxGeometry args={[3.3, 0.38, 1.9]} />
      </Part>

      {/* nave (main body) */}
      <Part built={built(WALLS)} color={WALL} position={[0, 1.15, 0]}>
        <boxGeometry args={[2.5, 1.5, 1.5]} />
      </Part>
      {/* apse (rounded east end) */}
      <Part built={built(WALLS)} color={WALL} position={[1.25, 1.1, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 1.42, 32, 1, false, -Math.PI / 2, Math.PI]} />
      </Part>
      {/* narthex / west entrance block */}
      <Part built={built(WALLS)} color={WALL} position={[-1.5, 1.0, 0]}>
        <boxGeometry args={[0.6, 1.2, 1.2]} />
      </Part>

      {/* door */}
      <Part built={built(WALLS)} color={WOOD} position={[-1.81, 0.72, 0]}>
        <boxGeometry args={[0.06, 0.8, 0.42]} />
      </Part>
      {/* arched side windows (nave, both sides) */}
      {[-0.55, 0.3].flatMap((x) =>
        [0.76, -0.76].map((z) => (
          <group key={`${x}:${z}`}>
            <Part built={built(WALLS)} color={GLASS} position={[x, 1.2, z]}>
              <boxGeometry args={[0.34, 0.6, 0.05]} />
            </Part>
            <Part built={built(WALLS)} color={GLASS} position={[x, 1.5, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.17, 0.17, 0.05, 16, 1, false, 0, Math.PI]} />
            </Part>
          </group>
        )),
      )}

      {/* ── roof: two slopes forming a gable over the nave ─────────────── */}
      <Part
        built={built(ROOFS)}
        color={ROOF}
        ghostColor={ROOF_DARK}
        position={[-0.62, 2.12, 0]}
        rotation={[0, 0, 0.427]}
      >
        <boxGeometry args={[1.5, 0.1, 1.72]} />
      </Part>
      <Part
        built={built(ROOFS)}
        color={ROOF}
        ghostColor={ROOF_DARK}
        position={[0.62, 2.12, 0]}
        rotation={[0, 0, -0.427]}
      >
        <boxGeometry args={[1.5, 0.1, 1.72]} />
      </Part>
      {/* ridge cap (hides the seam) */}
      <Part built={built(ROOFS)} color={ROOF_DARK} ghostColor={ROOF_DARK} position={[0, 2.44, 0]}>
        <boxGeometry args={[0.14, 0.12, 1.74]} />
      </Part>
      {/* apse conical roof */}
      <Part built={built(ROOFS)} color={ROOF} ghostColor={ROOF_DARK} position={[1.25, 2.12, 0]}>
        <coneGeometry args={[0.82, 0.62, 28, 1, false, -Math.PI / 2, Math.PI]} />
      </Part>

      {/* ── central tower (turlă) + onion dome + cross ─────────────────── */}
      <Part built={built(TOWER)} color={WALL} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.52, 0.56, 1.25, 28]} />
      </Part>
      <Part built={built(TOWER)} color={WALL_SHADE} position={[0, 3.16, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.12, 28]} />
      </Part>
      <Part
        built={built(TOWER)}
        color={GOLD}
        metalness={0.7}
        roughness={0.28}
        ghostColor={GOLD}
        position={[0, 3.22, 0]}
        geometry={dome}
      />
      <Cross built={built(CROSS)} y={4.32} s={1.05} />

      {/* ── front bell tower (clopotniță) over the entrance ─────────────── */}
      <group position={[-1.5, 0, 0]}>
        <Part built={built(TOWER)} color={WALL} position={[0, 2.15, 0]}>
          <boxGeometry args={[0.66, 1.1, 0.66]} />
        </Part>
        <Part built={built(TOWER)} color={WALL_SHADE} position={[0, 2.74, 0]}>
          <boxGeometry args={[0.76, 0.12, 0.76]} />
        </Part>
        <Part
          built={built(TOWER)}
          color={GOLD}
          metalness={0.7}
          roughness={0.28}
          ghostColor={GOLD}
          position={[0, 2.8, 0]}
          geometry={domeMid}
        />
        <Cross built={built(CROSS)} y={3.55} s={0.7} />
      </group>

      {/* two small corner cupolas on the nave (east pair) */}
      {[
        [0.55, 0.52],
        [0.55, -0.52],
      ].map((pos, i) => (
        <group key={i} position={[pos[0], 0, pos[1]]}>
          <Part built={built(TOWER)} color={WALL} position={[0, 2.0, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 0.55, 20]} />
          </Part>
          <Part
            built={built(TOWER)}
            color={GOLD}
            metalness={0.7}
            roughness={0.3}
            ghostColor={GOLD}
            position={[0, 2.28, 0]}
            geometry={domeSmall}
          />
          <Cross built={built(CROSS)} y={2.74} s={0.42} />
        </group>
      ))}
    </group>
  );
}

export default function Church3D({ percent = 0 }: { percent?: number }) {
  return (
    <div className="relative w-full" style={{ height: 'min(68vh, 440px)' }}>
      <Canvas shadows camera={{ position: [5.8, 3.4, 6.4], fov: 40 }} dpr={[1, 2]}>
        <color attach="background" args={['#f7edd9']} />
        <fog attach="fog" args={['#f7edd9', 11, 22]} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[6, 10, 5]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#ffe9c4" />
        <Float speed={1.2} rotationIntensity={0} floatIntensity={0.25} floatingRange={[-0.04, 0.04]}>
          <Church percent={percent} />
        </Float>
        <ContactShadows position={[0, -1.18, 0]} opacity={0.38} scale={14} blur={2.6} far={6} />
        <Environment preset="sunset" />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4.5}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
    </div>
  );
}

'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const STONE = '#ece0c6';
const STONE_DARK = '#d9c6a0';
const ROOF = '#5b2a22';
const GOLD = '#c9a361';
const GOLD_HI = '#e7c987';

/** A church part: solid when built, faint wireframe "scaffolding" when not. */
function Part({
  built,
  color,
  metalness = 0,
  roughness = 0.9,
  children,
  ...props
}: any) {
  return (
    <mesh castShadow receiveShadow {...props}>
      {children}
      {built ? (
        <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
      ) : (
        <meshStandardMaterial color={GOLD} wireframe transparent opacity={0.16} />
      )}
    </mesh>
  );
}

/** Onion-dome lathe profile (signature Orthodox cupola). */
function onionGeometry(scale = 1) {
  const pts = [
    [0.0, 0.0],
    [0.52, 0.06],
    [0.66, 0.34],
    [0.5, 0.64],
    [0.22, 0.86],
    [0.08, 0.98],
    [0.0, 1.06],
  ].map(([x, y]) => new THREE.Vector2(x * scale, y * scale));
  return new THREE.LatheGeometry(pts, 48);
}

function Church({ percent }: { percent: number }) {
  const g = useRef<THREE.Group>(null);
  const p = Math.max(0, Math.min(100, percent));
  const built = (at: number) => p >= at;

  const dome = useMemo(() => onionGeometry(1), []);
  const domeSmall = useMemo(() => onionGeometry(0.55), []);

  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={g} position={[0, -0.9, 0]}>
      {/* ground base */}
      <mesh receiveShadow position={[0, -0.12, 0]}>
        <cylinderGeometry args={[3.4, 3.4, 0.24, 48]} />
        <meshStandardMaterial color="#cdbd98" roughness={1} />
      </mesh>

      {/* foundation */}
      <Part built={built(4)} color={STONE_DARK} position={[0, 0.12, 0]}>
        <boxGeometry args={[3.0, 0.3, 1.9]} />
      </Part>

      {/* nave (main body) */}
      <Part built={built(18)} color={STONE} position={[0, 0.95, 0]}>
        <boxGeometry args={[2.6, 1.4, 1.5]} />
      </Part>
      {/* apse (back, rounded) */}
      <Part built={built(18)} color={STONE} position={[1.5, 0.9, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 1.3, 24, 1, false, -Math.PI / 2, Math.PI]} />
      </Part>
      {/* porch (front, narthex) */}
      <Part built={built(18)} color={STONE} position={[-1.5, 0.78, 0]}>
        <boxGeometry args={[0.6, 1.0, 1.1]} />
      </Part>

      {/* door + windows (accents) */}
      <Part built={built(32)} color={ROOF} position={[-1.81, 0.62, 0]}>
        <boxGeometry args={[0.05, 0.7, 0.4]} />
      </Part>
      {[-0.6, 0.4].map((z) => (
        <Part key={z} built={built(32)} color="#86a0c6" position={[-1.31, 1.0, z]}>
          <boxGeometry args={[0.05, 0.5, 0.28]} />
        </Part>
      ))}

      {/* nave roof */}
      <Part built={built(50)} color={ROOF} position={[0, 1.95, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.0, 1.0, 1.52]} />
      </Part>

      {/* central tower */}
      <Part built={built(66)} color={STONE} position={[0, 2.55, 0]}>
        <cylinderGeometry args={[0.6, 0.62, 1.1, 24]} />
      </Part>
      {/* tower cornice */}
      <Part built={built(66)} color={STONE_DARK} position={[0, 3.12, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 0.14, 24]} />
      </Part>

      {/* onion dome */}
      <Part
        built={built(82)}
        color={GOLD}
        metalness={0.6}
        roughness={0.28}
        position={[0, 3.2, 0]}
        geometry={dome}
      />
      {/* small domes on corners */}
      {[
        [-0.95, 2.0, 0.55],
        [-0.95, 2.0, -0.55],
      ].map((pos, i) => (
        <group key={i}>
          <Part built={built(82)} color={STONE} position={[pos[0], pos[1], pos[2]]}>
            <cylinderGeometry args={[0.22, 0.24, 0.5, 16]} />
          </Part>
          <Part
            built={built(82)}
            color={GOLD}
            metalness={0.6}
            roughness={0.3}
            position={[pos[0], pos[1] + 0.28, pos[2]]}
            geometry={domeSmall}
          />
        </group>
      ))}

      {/* cross on the dome (glows) */}
      <group position={[0, 4.35, 0]}>
        <Part built={built(95)} color={GOLD_HI} metalness={0.7} roughness={0.2} position={[0, 0.25, 0]}>
          <boxGeometry args={[0.07, 0.75, 0.07]} />
        </Part>
        <Part built={built(95)} color={GOLD_HI} metalness={0.7} roughness={0.2} position={[0, 0.42, 0]}>
          <boxGeometry args={[0.42, 0.07, 0.07]} />
        </Part>
      </group>
    </group>
  );
}

export default function Church3D({ percent = 0 }: { percent?: number }) {
  return (
    <div className="relative w-full" style={{ height: 'min(70vh, 460px)' }}>
      <Canvas shadows camera={{ position: [5.5, 3.6, 6.2], fov: 42 }} dpr={[1, 2]}>
        <color attach="background" args={['#f6ecd8']} />
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[6, 9, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Church percent={percent} />
        <ContactShadows position={[0, -1.0, 0]} opacity={0.4} scale={12} blur={2.4} far={5} />
        <Environment preset="sunset" />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={5}
          maxDistance={11}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

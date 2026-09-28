"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Level 2 of the depth system: a single, slow-moving glass crystal with light
 * rings and a sparse particle shell. Loaded lazily (see hero-stage.tsx) and
 * never mounted on phones or with reduced motion.
 */

const ACCENT = "#6f86ff";

export type PointerRef = RefObject<{ x: number; y: number }>;

/** A soft studio environment for realistic glass reflections — generated, no texture downloads. */
function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const texture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return texture;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  // Attached declaratively to the scene (R3F sets scene.environment and restores it on unmount).
  return <primitive object={env} attach="environment" />;
}

function Crystal({ pointer }: { pointer: PointerRef }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = pointer.current ?? { x: 0, y: 0 };
    g.rotation.y += delta * 0.1;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.35 + p.y * 0.22 + Math.sin(t * 0.3) * 0.04, 0.035);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -p.x * 0.18, 0.035);
    g.position.y = Math.sin(t * 0.55) * 0.07;
  });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.08, 0]} />
        <meshPhysicalMaterial
          color="#e9ecff"
          transmission={1}
          thickness={1.3}
          roughness={0.04}
          ior={1.5}
          iridescence={0.7}
          iridescenceIOR={1.35}
          clearcoat={1}
          clearcoatRoughness={0.05}
          attenuationColor="#7f93ff"
          attenuationDistance={2.8}
          envMapIntensity={1.05}
          specularIntensity={1}
          flatShading
        />
      </mesh>
      {/* Hairline edges catch the light like cut glass */}
      <mesh scale={1.003}>
        <icosahedronGeometry args={[1.08, 0]} />
        <meshBasicMaterial color="#9fb0ff" wireframe transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Rings() {
  const a = useRef<THREE.Mesh>(null);
  const b = useRef<THREE.Mesh>(null);
  const satellite = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (a.current) a.current.rotation.z += delta * 0.07;
    if (b.current) b.current.rotation.z -= delta * 0.045;
    if (satellite.current) {
      const t = state.clock.elapsedTime * 0.35;
      satellite.current.position.set(Math.cos(t) * 1.72, Math.sin(t) * 0.45, Math.sin(t) * 1.0);
    }
  });
  return (
    <group rotation={[0.2, 0, 0.12]}>
      <mesh ref={a} rotation={[1.25, 0.15, 0]}>
        <torusGeometry args={[1.72, 0.006, 8, 200]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={b} rotation={[1.42, -0.45, 0.35]}>
        <torusGeometry args={[2.12, 0.004, 8, 220]} />
        <meshBasicMaterial color="#b9c4ff" transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={satellite}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial color="#ffffff" emissive={ACCENT} emissiveIntensity={2.2} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Particles({ count = 200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    // Deterministic pseudo-random spherical shell (stable across renders).
    const arr = new Float32Array(count * 3);
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < count; i++) {
      const r = 1.9 + rand() * 1.1;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.7;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} sizeAttenuation color="#dfe4ff" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

export default function HeroScene({ pointer, running }: { pointer: PointerRef; running: boolean }) {
  return (
    <Canvas
      frameloop={running ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.6], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      aria-hidden
    >
      <StudioEnvironment />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-3, -1.2, 2.2]} intensity={22} color={ACCENT} />
      <pointLight position={[3.2, -2, -2]} intensity={14} color="#a07bff" />
      {/* Centered: the crystal is the focal object; glass UI chips float in front of it. */}
      <group position={[0, 0.1, 0]}>
        <Crystal pointer={pointer} />
        <Rings />
      </group>
      <Particles />
    </Canvas>
  );
}

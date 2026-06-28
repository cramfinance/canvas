import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useTexture,
  RoundedBox
} from "@react-three/drei";
import * as THREE from "three";

export type EnvPreset = "studio" | "cinematic" | "stark";

interface SceneProps {
  frontUrl: string | null;
  backUrl: string | null;
  depth: number;
  spinning: boolean;
  speed: number;
  env: EnvPreset;
  background: string;
}

const FALLBACK_COLOR = "#1a1a22";
// A tiny 1x1 transparent pixel to act as a placeholder before you upload a card
const BLANK_TEX = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function Card({
  frontUrl,
  backUrl,
  depth,
  spinning,
  speed,
}: Omit<SceneProps, "env" | "background">) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && spinning) {
      meshRef.current.rotation.y += delta * speed;
    }
  });

  // Drei's native suspense-based texture loading. This fixes the upload bug permanently.
  const frontTex = useTexture(frontUrl || BLANK_TEX);
  const backTex = useTexture(backUrl || BLANK_TEX);
  frontTex.colorSpace = THREE.SRGBColorSpace;
  backTex.colorSpace = THREE.SRGBColorSpace;

  // Standard credit-card aspect ratio: 85.6 x 53.98 mm ≈ 1.586
  const width = 3.2;
  const height = width / 1.586;

  return (
    <RoundedBox
      ref={meshRef}
      castShadow
      receiveShadow
      args={[width, height, depth * 0.1]}
      radius={0.08}
      smoothness={4}
      position={[0, 0, 0]}
    >
      {/* Materials 0-3 map to the curved plastic side edges */}
      <meshStandardMaterial attach="material-0" color="#0a0a0a" roughness={0.6} metalness={0.4} />
      <meshStandardMaterial attach="material-1" color="#0a0a0a" roughness={0.6} metalness={0.4} />
      <meshStandardMaterial attach="material-2" color="#0a0a0a" roughness={0.6} metalness={0.4} />
      <meshStandardMaterial attach="material-3" color="#0a0a0a" roughness={0.6} metalness={0.4} />
      
      {/* Materials 4 & 5 map to the Front and Back faces. transparent={true} allows the PNG curves to work. */}
      <meshStandardMaterial 
        attach="material-4" 
        color={frontUrl ? "#ffffff" : FALLBACK_COLOR} 
        map={frontUrl ? frontTex : null} 
        roughness={0.55} 
        metalness={0.25} 
        transparent={true} 
      />
      <meshStandardMaterial 
        attach="material-5" 
        color={backUrl ? "#ffffff" : FALLBACK_COLOR} 
        map={backUrl ? backTex : null} 
        roughness={0.55} 
        metalness={0.25} 
        transparent={true} 
      />
    </RoundedBox>
  );
}

const ENV_CONFIG: Record<
  EnvPreset,
  { preset: "studio" | "city" | "warehouse" | "sunset" | "night"; intensity: number; key: number; fill: number }
> = {
  studio: { preset: "studio", intensity: 0.9, key: 1.4, fill: 0.5 },
  cinematic: { preset: "night", intensity: 0.4, key: 1.8, fill: 0.15 },
  stark: { preset: "warehouse", intensity: 1.2, key: 1.2, fill: 0.8 },
};

export default function CardScene(props: SceneProps) {
  const cfg = ENV_CONFIG[props.env];

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.2, 5], fov: 35 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[props.background]} />
      <fog attach="fog" args={[props.background, 8, 20]} />

      <ambientLight intensity={cfg.fill} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={cfg.key}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 2, -3]} intensity={cfg.fill * 0.6} />

      <Suspense fallback={null}>
        <Card {...props} />
        <Environment preset={cfg.preset} environmentIntensity={cfg.intensity} />
      </Suspense>

      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.55}
        scale={10}
        blur={2.6}
        far={3}
      />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={9}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
      />
    </Canvas>
  );
}

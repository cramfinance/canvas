import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
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

function useCardTexture(url: string | null) {
  return useMemo(() => {
    if (!url) return null;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    const tex = loader.load(url, (t) => {
      t.needsUpdate = true;
    });
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    return tex;
  }, [url]);
}

function Card({
  frontUrl,
  backUrl,
  depth,
  spinning,
  speed,
}: Omit<SceneProps, "env" | "background">) {
  const meshRef = useRef<THREE.Mesh>(null);
  const front = useCardTexture(frontUrl);
  const back = useCardTexture(backUrl);

  useFrame((_, delta) => {
    if (meshRef.current && spinning) {
      meshRef.current.rotation.y += delta * speed;
    }
  });

  const sideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0a0a",
        roughness: 0.6,
        metalness: 0.4,
      }),
    [],
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: front ? "#ffffff" : FALLBACK_COLOR,
        map: front ?? null,
        roughness: 0.55,
        metalness: 0.25,
      }),
    [front],
  );

  const backMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: back ? "#ffffff" : FALLBACK_COLOR,
        map: back ?? null,
        roughness: 0.55,
        metalness: 0.25,
      }),
    [back],
  );

  // BoxGeometry face order: +x, -x, +y, -y, +z (front), -z (back)
  const materials = useMemo(
    () => [
      sideMaterial,
      sideMaterial,
      sideMaterial,
      sideMaterial,
      frontMaterial,
      backMaterial,
    ],
    [sideMaterial, frontMaterial, backMaterial],
  );

  const width = 3.2;
  const height = width / 1.586;

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      material={materials}
      position={[0, 0, 0]}
    >
      <boxGeometry args={[width, height, depth * 0.1]} />
    </mesh>
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
      camera={{ position: [0, 0, 5], fov: 35 }}
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
        enableRotate={false}
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={9}
      />
    </Canvas>
  );
}

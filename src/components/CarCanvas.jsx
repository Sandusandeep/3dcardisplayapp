import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useTexture,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import CarModel from "./CarModel";
import { Text3D } from "@react-three/drei";
import { a } from "@react-spring/three";
// function RotatingPlatform({ children }) {
//   const ref = useRef();

//   useFrame(() => {
//     if (ref.current) {
//       ref.current.rotation.y += 0.002;
//     }
//   });

//   return <group ref={ref}>{children}</group>;
// }
function DisplayStage({ children }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const [colorMap, normalMap, aoMap] = useTexture([
    "/textures/marble/marble_01_diff_4k.jpg",
    "/textures/marble/marble_normal.jpg",
    "/textures/marble/marble_01_ao_4k.jpg",
  ]);

  colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
  aoMap.wrapS = aoMap.wrapT = THREE.RepeatWrapping;

  colorMap.repeat.set(6, 6);
  normalMap.repeat.set(6, 6);
  aoMap.repeat.set(6, 6);

  return (
    <group ref={groupRef}>
      {/* Solid Base Cylinder */}
      <mesh receiveShadow>
        <cylinderGeometry args={[6, 6, 0.6, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Marble Top Surface */}
      <mesh position={[0, 0.31, 0]} receiveShadow>
        <cylinderGeometry args={[6, 6, 0.05, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          aoMap={aoMap}
          metalness={0.1}
          roughness={0.45}
          envMapIntensity={0.6}
          clearcoat={1}
          clearcoatRoughness={0.3}
        />
      </mesh>

      {/* Subtle Glow Ring */}
      <mesh position={[0, 0.32, 0]}>
        <ringGeometry args={[6.05, 6.2, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>

      {/* Car */}
      <group position={[0, 0.35, 0]}>{children}</group>
    </group>
  );
}

function formatCarName(path) {
  const file = path.split("/").pop(); // get filename
  const name = file.replace(".glb", "");

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function LightSweep() {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t) * 15;
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 8, 10]}
      intensity={2}
      angle={0.3}
      penumbra={1}
      castShadow
    />
  );
}
// function MarbleFloor() {
//   const [colorMap, normalMap, aoMap] = useTexture([
//     "/textures/marble/marble_01_diff_4k.jpg",
//     "/textures/marble/marble_normal.jpg",
//     "/textures/marble/marble_01_ao_4k.jpg",
//   ]);

//   colorMap.wrapS = colorMap.wrapT = THREE.RepeatWrapping;
//   normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping;
//   aoMap.wrapS = aoMap.wrapT = THREE.RepeatWrapping;

//   colorMap.repeat.set(25, 25);
//   normalMap.repeat.set(25, 25);
//   aoMap.repeat.set(25, 25);

//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
//       <planeGeometry args={[600, 600]} />
//       <meshStandardMaterial
//         map={colorMap}
//         normalMap={normalMap}
//         aoMap={aoMap}
//         metalness={0.1}
//         roughness={0.45}
//         envMapIntensity={0.6}
//         clearcoat={1}
//         clearcoatRoughness={0.3}
//       />
//     </mesh>
//   );
// }

export default function CarCanvas({
  modelPath,
  nextCar,
  prevCar,
  activeIndex,
}) {
  return (
    <div className="canvas-container">
      <button className="arrow left" onClick={prevCar}>
        ◀
      </button>

      <Canvas
        shadows
        camera={{ position: [0, 2, 10], fov: 45 }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
        }}
      >
        {/* HDR Lighting Only */}
        <Environment files="/hdr/studio.hdr" />

        {/* Lighting */}
        <ambientLight intensity={0.25} />
        {/* <directionalLight position={[0, 15, 5]} intensity={1.6} castShadow />
        <directionalLight position={[-10, 6, -10]} intensity={1} />
        <directionalLight position={[10, 4, -15]} intensity={1.8} /> */}
        <directionalLight position={[0, 15, 8]} intensity={1.6} castShadow />

        {/* Animated Light Sweep */}
        <LightSweep intensity={1.2} />

        {/* Architecture */}
        {/* <MarbleFloor /> */}
        <DisplayStage key={modelPath}>
          <CarModel modelPath={modelPath} />
        </DisplayStage>

        {/* Back Wall */}
        <mesh position={[0, 6, -120]}>
          <planeGeometry args={[300, 20]} />
          <meshStandardMaterial color="#181818" roughness={0.8} />
        </mesh>

        {/* Rotating Platform */}
        {/* <RotatingPlatform key={modelPath}>
          <CarModel modelPath={modelPath} />
        </RotatingPlatform> */}

        {/* Contact Shadows */}
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.4}
          scale={20}
          blur={3}
          far={15}
        />

        <OrbitControls
          target={[0, 1, 0]}
          minDistance={6}
          maxDistance={14}
          enablePan={false}
        />

        {/* Postprocessing */}
        <EffectComposer>
          <Bloom
            intensity={0.22}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.9}
          />
          <Vignette eskil={false} offset={0.2} darkness={0.8} />
        </EffectComposer>

        <fog attach="fog" args={["#111111", 60, 200]} />
        <a.group>
          <Text3D
            font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
            size={2.5}
            height={0.5} // extrusion depth
            curveSegments={32}
            position={[0, 8, -118]}
          >
            {formatCarName(modelPath)}

            <meshPhysicalMaterial
              color="#ffffff" // luxury gold
              metalness={1}
              roughness={0.85}
              clearcoat={1}
              clearcoatRoughness={0.6}
            />
          </Text3D>
        </a.group>
      </Canvas>

      <button className="arrow right" onClick={nextCar}>
        ▶
      </button>
    </div>
  );
}

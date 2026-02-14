import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

export default function CarModel({ modelPath }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();

  // 🔥 Clone model to prevent shared transformations
  const clonedScene = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    // Reset transforms
    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDimension = Math.max(size.x, size.y, size.z);

    // 🔥 Target visual size (adjust this if needed)
    const desiredSize = 5;
    const scale = desiredSize / maxDimension;

    clonedScene.scale.setScalar(scale);

    // Recalculate after scaling
    const newBox = new THREE.Box3().setFromObject(clonedScene);
    const newCenter = newBox.getCenter(new THREE.Vector3());

    // Center horizontally
    clonedScene.position.x -= newCenter.x;
    clonedScene.position.z -= newCenter.z;

    // Align bottom to ground
    clonedScene.position.y -= newBox.min.y;
  }, [clonedScene]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Instances, Instance } from '@react-three/drei';

function generatePetals(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      position: [
        (Math.random() - 0.5) * 15, // wide X spread
        Math.random() * 20 + 5,      // start high above camera
        (Math.random() - 0.5) * 10 - 2 // deep Z spread
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ],
      speed: {
        y: Math.random() * 0.03 + 0.015,
        rotX: Math.random() * 0.02 - 0.01,
        rotY: Math.random() * 0.02 - 0.01,
        rotZ: Math.random() * 0.02 - 0.01,
        driftX: Math.random() * 0.01 - 0.005
      },
      scale: Math.random() * 0.6 + 0.4
    });
  }
  return arr;
}

export default function FallingPetals({ count = 80 }) {
  const groupRef = useRef();

  // Create a mathematical curved petal geometry once
  const petalGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(0.35, 0.45, 8, 8);
    const position = geometry.attributes.position;
    
    // Deform the vertices to create a beautiful, organic curved cup shape
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      // Gentle parabolic curve to mimic a rose petal
      const z = -(x * x + y * y) * 1.5; 
      position.setZ(i, z);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Pre-calculate random properties for each petal instance safely
  const [petals] = useState(() => generatePetals(count));

  const refs = useRef([]);

  useFrame(() => {
    if (!refs.current.length) return;
    
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const data = petals[i];
      
      // Fall down and drift
      ref.position.y -= data.speed.y;
      ref.position.x += data.speed.driftX;

      // Rotate gracefully in 3D
      ref.rotation.x += data.speed.rotX;
      ref.rotation.y += data.speed.rotY;
      ref.rotation.z += data.speed.rotZ;

      // Reset to the top once they fall past the camera frustum
      if (ref.position.y < -15) {
        ref.position.y = 15;
        ref.position.x = (Math.random() - 0.5) * 15;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <Instances range={count}>
        <primitive object={petalGeometry} attach="geometry" />
        <meshStandardMaterial 
          color="#8B0000" // Deep Velvet Crimson
          roughness={0.9} // Soft, velvety petal texture
          metalness={0.05}
          side={THREE.DoubleSide}
        />
        {petals.map((data, i) => (
          <Instance
            key={i}
            ref={(el) => (refs.current[i] = el)}
            position={data.position}
            rotation={data.rotation}
            scale={data.scale}
          />
        ))}
      </Instances>
    </group>
  );
}

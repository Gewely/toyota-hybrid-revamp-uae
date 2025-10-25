import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface Vehicle3DModelProps {
  rotation?: number;
  color?: string;
  autoRotate?: boolean;
  className?: string;
}

const CarMesh = ({ rotation = 0, color = '#c41e3a' }: { rotation: number; color: string }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation * (Math.PI / 180);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>

      {/* Car Cabin */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.6, 2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 1.2, -0.3]}>
        <boxGeometry args={[1.55, 0.55, 1.95]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.1} 
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Wheels */}
      {[
        [-0.8, 0, 1.3],
        [0.8, 0, 1.3],
        [-0.8, 0, -1.3],
        [0.8, 0, -1.3],
      ].map((position, i) => (
        <group key={i} position={position as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Grille */}
      <mesh position={[0, 0.5, 2.01]}>
        <boxGeometry args={[1.2, 0.4, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Headlights */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 2.02]}>
          <boxGeometry args={[0.3, 0.2, 0.05]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

export const Vehicle3DModel: React.FC<Vehicle3DModelProps> = ({ 
  rotation = 0, 
  color = '#c41e3a',
  autoRotate = false,
  className = ''
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.5} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight 
            position={[-5, 5, 5]} 
            intensity={0.8} 
            angle={0.3}
            penumbra={1}
            castShadow
          />

          {/* Environment */}
          <Environment preset="sunset" />

          {/* Car Model */}
          <CarMesh rotation={rotation} color={color} />

          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.3} />
          </mesh>

          {/* Controls */}
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.5}
            autoRotate={autoRotate}
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Maximize2, RotateCw } from 'lucide-react';
import * as THREE from 'three';

interface VehicleViewer360Props {
  color?: string;
  showControls?: boolean;
  autoRotate?: boolean;
  view?: 'exterior' | 'interior';
}

const VehicleModel = ({ color = '#cc0000' }: { color: string }) => {
  return (
    <group>
      {/* Car Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[4, 1.2, 2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car Top */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.5, 0.8, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windows */}
      <mesh position={[0.5, 1.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.7, 1.7]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.3} 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>

      {/* Wheels */}
      {[
        [-1.3, 0.3, 1],
        [-1.3, 0.3, -1],
        [1.3, 0.3, 1],
        [1.3, 0.3, -1],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      <mesh position={[2.1, 0.8, 0.7]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[2.1, 0.8, -0.7]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-2.1, 0.7, 0.8]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-2.1, 0.7, -0.8]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.3]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>

      {/* Ground Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  );
};

export const VehicleViewer360: React.FC<VehicleViewer360Props> = ({
  color = '#cc0000',
  showControls = true,
  autoRotate = true,
  view = 'exterior',
}) => {
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleReset = () => {
    setRotation(0);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'w-full h-[400px] md:h-[500px]'} rounded-xl overflow-hidden border border-border/50`}>
      <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <spotLight position={[-10, 10, -5]} intensity={0.3} />
        
        {/* Environment */}
        <Environment preset="sunset" />
        
        {/* Vehicle Model */}
        <VehicleModel color={color} />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate={autoRotate}
          autoRotateSpeed={2}
        />
      </Canvas>

      {/* UI Controls */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-4 py-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Reset View
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-4 py-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </motion.button>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg text-xs text-muted-foreground border border-border/50">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

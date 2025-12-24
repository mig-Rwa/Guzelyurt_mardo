'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { Image as DreiImage, Text, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/utils';

interface GalleryCard3DProps {
  url: string;
  position: [number, number, number];
  index: number;
  onClick: () => void;
}

function GalleryCard3D({ url, position, index, onClick }: GalleryCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle idle animation
      if (!reducedMotion) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.05;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3 + index * 0.5) * 0.05;
      }
      
      // Hover effect
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <planeGeometry args={[2, 1.5]} />
      <meshStandardMaterial color="#1e1919" />
      {/* Image texture */}
      <DreiImage
        url={url}
        scale={[1.9, 1.4]}
        position={[0, 0, 0.01]}
      />
      {/* Glow effect on hover */}
      {hovered && (
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[2.2, 1.7]} />
          <meshBasicMaterial color="#fad24b" transparent opacity={0.3} />
        </mesh>
      )}
    </mesh>
  );
}

interface Gallery3DProps {
  images: string[];
  onImageClick: (url: string) => void;
}

export default function Gallery3D({ images, onImageClick }: Gallery3DProps) {
  const limitedImages = images.slice(0, 6);
  
  // Calculate grid positions
  const getPosition = (index: number): [number, number, number] => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return [
      (col - 1) * 2.5,
      -row * 2,
      0
    ];
  };

  return (
    <div className="h-[400px] w-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, -0.5, 8]} fov={45} />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-5, 5, 5]} intensity={0.3} color="#fad24b" />
        
        <Environment preset="city" />
        
        <group position={[0, 1, 0]}>
          {limitedImages.map((url, index) => (
            <GalleryCard3D
              key={index}
              url={url}
              position={getPosition(index)}
              index={index}
              onClick={() => onImageClick(url)}
            />
          ))}
        </group>
      </Canvas>
    </div>
  );
}

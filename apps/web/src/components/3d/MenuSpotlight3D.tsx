'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image as DreiImage, Float, Environment, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion, isWebGLSupported } from '@/lib/utils';
import type { MenuItem } from '@shared/types';
import type { Language } from '@shared/types';

interface MenuSpotlightCardProps {
  item: MenuItem;
  language: Language;
}

function MenuSpotlightCard({ item, language }: MenuSpotlightCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Card background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#1e1919" opacity={0.9} transparent />
      </mesh>
      
      {/* Image */}
      <DreiImage
        url={item.image}
        scale={[3, 2]}
        position={[0, 0.1, 0]}
      />
      
      {/* Price badge */}
      <mesh position={[1.3, 0.9, 0.1]}>
        <circleGeometry args={[0.35, 32]} />
        <meshStandardMaterial color="#fad24b" />
      </mesh>
      
      {/* Decorative border */}
      <mesh position={[0, 0, 0.05]}>
        <ringGeometry args={[1.7, 1.8, 64]} />
        <meshBasicMaterial color="#fad24b" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

interface MenuSpotlight3DProps {
  item: MenuItem;
  language: Language;
}

export default function MenuSpotlight3D({ item, language }: MenuSpotlight3DProps) {
  const [webGLSupported, setWebGLSupported] = useState(true);
  
  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
  }, []);

  if (!webGLSupported) {
    return null;
  }

  return (
    <div className="h-[300px] w-full">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <spotLight position={[0, 5, 5]} intensity={0.5} angle={0.3} penumbra={1} color="#fad24b" />
        
        <Environment preset="city" />
        
        <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.2}>
          <MenuSpotlightCard item={item} language={language} />
        </Float>
      </Canvas>
    </div>
  );
}

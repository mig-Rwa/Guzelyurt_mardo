'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/utils';

// Individual stamp on the card
function Stamp({ position, filled, index }: { position: [number, number, number]; filled: boolean; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (meshRef.current && filled && !reducedMotion) {
      // Subtle pulse for filled stamps
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Stamp circle */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
        <meshStandardMaterial 
          color={filled ? '#fad24b' : '#3d3d3d'} 
          roughness={filled ? 0.3 : 0.8}
          metalness={filled ? 0.2 : 0}
        />
      </mesh>
      
      {/* Coffee cup icon on filled stamps */}
      {filled && (
        <>
          {/* Cup body */}
          <mesh position={[0, 0.015, 0]}>
            <cylinderGeometry args={[0.06, 0.05, 0.08, 16]} />
            <meshStandardMaterial color="#5d4037" roughness={0.5} />
          </mesh>
          {/* Steam */}
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        </>
      )}
      
      {/* Number for empty stamps */}
      {!filled && (
        <mesh position={[0, 0.015, 0]}>
          <ringGeometry args={[0.08, 0.1, 32]} />
          <meshStandardMaterial color="#555" />
        </mesh>
      )}
    </group>
  );
}

// Loyalty card
function LoyaltyCard({ stamps, totalStamps }: { stamps: number; totalStamps: number }) {
  const cardRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (cardRef.current && !reducedMotion) {
      // Gentle rotation on hover
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      cardRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  // Calculate stamp positions in a row
  const stampPositions: [number, number, number][] = [];
  const startX = -((totalStamps - 1) * 0.35) / 2;
  for (let i = 0; i < totalStamps; i++) {
    stampPositions.push([startX + i * 0.35, 0.08, 0]);
  }

  return (
    <group ref={cardRef}>
      {/* Card base */}
      <RoundedBox args={[2.5, 0.12, 1.4]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color="#1e1919" roughness={0.3} metalness={0.1} />
      </RoundedBox>
      
      {/* Gold trim */}
      <mesh position={[0, 0.065, 0]}>
        <boxGeometry args={[2.4, 0.01, 1.3]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Stamps */}
      {stampPositions.map((pos, i) => (
        <Stamp key={i} position={pos} filled={i < stamps} index={i} />
      ))}
      
      {/* Glow effect for progress */}
      <pointLight 
        position={[0, 0.3, 0]} 
        intensity={stamps / totalStamps * 0.5} 
        color="#fad24b" 
        distance={2} 
      />
    </group>
  );
}

// Floating coffee beans around the card
function FloatingBeans() {
  const beansRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (beansRef.current && !reducedMotion) {
      beansRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const beanPositions: [number, number, number][] = [
    [-1.8, 0.3, 0.5],
    [1.9, -0.2, -0.3],
    [-1.5, -0.4, -0.6],
    [1.6, 0.5, 0.4],
  ];

  return (
    <group ref={beansRef}>
      {beanPositions.map((pos, i) => (
        <Float key={i} speed={1.5 + i * 0.2} floatIntensity={0.4}>
          <mesh position={pos} scale={0.1} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <capsuleGeometry args={[0.5, 1, 8, 16]} />
            <meshStandardMaterial color="#4a3728" roughness={0.6} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

interface Loyalty3DProps {
  stamps: number;
  totalStamps: number;
}

export default function Loyalty3D({ stamps, totalStamps }: Loyalty3DProps) {
  return (
    <div className="h-[180px] w-full max-w-[350px]">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 2, 4]} fov={30} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[-3, 2, 3]} intensity={0.3} color="#fad24b" />
        
        {/* Elements */}
        <Float speed={1} floatIntensity={0.2} rotationIntensity={0.05}>
          <LoyaltyCard stamps={stamps} totalStamps={totalStamps} />
        </Float>
        
        <FloatingBeans />
      </Canvas>
    </div>
  );
}

'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLSupported, prefersReducedMotion } from '@/lib/utils';

// Floating coffee cup mesh
function CoffeeCup() {
  const meshRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]} scale={1.2}>
      {/* Cup body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.8, 32]} />
        <meshStandardMaterial color="#c4a77d" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Cup handle */}
      <mesh position={[0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#c4a77d" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Coffee inside */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.15, 32]} />
        <meshStandardMaterial color="#3d2314" roughness={0.8} />
      </mesh>
      
      {/* Steam particles (simplified) */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.1, 0.75, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      <mesh position={[-0.08, 0.85, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// Coffee beans floating around
function CoffeeBeans() {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const beanPositions: [number, number, number][] = [
    [-1.5, 0.5, 0.5],
    [1.8, -0.3, -0.5],
    [-1.2, -0.8, 1],
    [1.5, 0.8, 0.8],
    [-0.8, 1.2, -0.8],
  ];

  return (
    <group ref={groupRef}>
      {beanPositions.map((pos, i) => (
        <Float key={i} speed={1 + i * 0.2} floatIntensity={0.5} rotationIntensity={0.3}>
          <mesh position={pos} scale={0.15}>
            <capsuleGeometry args={[0.5, 1, 8, 16]} />
            <meshStandardMaterial color="#4a3728" roughness={0.6} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function Hero3D() {
  const [webGLSupported, setWebGLSupported] = useState(true);
  
  useEffect(() => {
    setWebGLSupported(isWebGLSupported());
  }, []);

  if (!webGLSupported) {
    return null; // Fallback handled in parent component
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, 5, 5]} intensity={0.3} color="#fad24b" />
        
        {/* 3D Elements */}
        <Float speed={2} floatIntensity={0.5} rotationIntensity={0.2}>
          <CoffeeCup />
        </Float>
        
        <CoffeeBeans />
      </Canvas>
    </div>
  );
}
